import WebUtils from './WebUtils';

let dataBase = null;
export default class Database {
    static initTables() {
        if (window.Settings.enableLog)
            WebUtils.log("Database.initTables()");
        let stmt = "CREATE TABLE IF NOT EXISTS PROJECTS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MTIME DATETIME, ALTMD5 TEXT, POS INTEGER, NAME TEXT, JSON TEXT, THUMBNAIL TEXT, OWNER TEXT, GALLERY TEXT, DELETED TEXT, VERSION TEXT, ISGIFT INTEGER DEFAULT 0)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERSHAPES (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, NAME TEXT, OWNER TEXT, SCALE TEXT, VERSION TEXT)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERBKGS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, OWNER TEXT,  VERSION TEXT)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERFILES (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, CONTEXT TEXT)";
        this._exec(stmt);
    }

    //re 0:表示成功 其他表示：Error
    static _fcnF(fcn, re, data = null) {
        WebUtils._fcnF(fcn, re, data);
    }

    static open(body) {
        if (dataBase != null)
            return;
        if (window.Settings.enableLog)
            WebUtils.log("Database.open({0})".format(body));
        dataBase = openDatabase(body, "1.0", "ScratchJr.db", 1024 * 1024, function () {});
        this.initTables();
        return "0";
    }

    static close(str) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.close({0})".format(str));
        return "0";
    }

    static _exec(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database._exec({0})".format(body));
        dataBase.transaction(function (tx) {
            tx.executeSql(body, [],
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database._exec({0} - success.)".format(body));
                    Database._fcnF(fcn, true);
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database._exec({0} - Error:{1})".format(body, error.message));
                    Database._fcnF(fcn, false);
                }
            );
        });
        return "success";
    }

    //executeSql函数有四个参数，其意义分别是：
    // 1）表示查询的字符串，使用的SQL语言是SQLite 3.6.19。（必选）
    // 2）插入到查询中问号所在处的字符串数据。（可选）
    // 3）成功时执行的回调函数。返回两个参数：tx和执行的结果。（可选）
    // 4）一个失败时执行的回调函数。返回两个参数：tx和失败的错误信息。（可选）
    static stmt(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.stmt({0})".format(body));
        let jsonData = JSON.parse(body);
        //"update db set fieldname = ?,mtime = ? where id = id"
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];

        dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database.stmt({0} - success.)".format(body));
                    try {
                        Database._fcnF(fcn, results.insertId);
                    } catch (error) {
                        Database._fcnF(fcn, true);
                    }
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database.stmt({0} - Error:{1})".format(body, error.message));
                    Database._fcnF(fcn, null);
                }
            );
        });
    }

    static _stmtBool(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database._stmtBool({0})".format(body));
        let jsonData = JSON.parse(body);
        //"update db set fieldname = ?,mtime = ? where id = id"
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];

        dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database._stmtBool({0} - success.)".format(body));
                    Database._fcnF(fcn, true);
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database._stmtBool({0} - Error:{1})".format(body, error.message));
                    Database._fcnF(fcn, false);
                }
            );
        });
    }

    //{"stmt":"select name,thumbnail,id,isgift from projects where deleted = ? AND version = ? AND gallery IS NULL order by ctime desc",
    // "values":["NO","iOSv01"]}
    static query(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.query({0})".format(body));
        Database._queryData(body, function (resArray) {
            if (resArray == null) {
                if (window.Settings.enableLog)
                    WebUtils.log("Database.query() - return:null)");
                Database._fcnF(fcn, null);
            } else {
                let jsonString = JSON.stringify(resArray);
                if (window.Settings.enableLog)
                    WebUtils.log("Database.query() - return:{0})".format(jsonString));
                Database._fcnF(fcn, jsonString);
            }
        });
    }

    static _queryData(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.queryData({0})".format(body));
        let jsonData = JSON.parse(body);
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];
        dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database.queryData({0} - success.)".format(body));
                    let resArray = [];
                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let rowData = results.rows.item(i);
                        if (window.Settings.enableLog)
                            WebUtils.log("Database.queryData() - results:{0})".format(JSON.stringify(rowData)));
                        resArray.push(rowData);
                    }
                    Database._fcnF(fcn, resArray);
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("Database.queryData({0} - Error:{1})".format(body, error.message));
                    Database._fcnF(fcn, null);
                });
        });
    }

    static _findDataIn(stmtstr, values, fcn) {
        let queryJson = {};
        queryJson["stmt"] = stmtstr;
        queryJson["values"] = values;
        return Database.query(JSON.stringify(queryJson), fcn);
    }

    //--------------test--------------------------
    static _setfield(db, id, fieldname, val, fcn) {
        var json = {};
        var keylist = [fieldname + ' = ?', ];
        json.values = [val];
        json.stmt = 'update ' + db + ' set ' + keylist.toString() + ' where id = ' + id;
        return Database._stmtBool(JSON.stringify(json), fcn);
    }

    static test() {
        if (window.Settings.enableLog)
            WebUtils.log("Database.test()");
        dataBase.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
            tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "foobar")');
            tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")');
        });

        Database._setfield("LOGS", 1, "log", "--foobar2--");
        // dataBase.transaction(function (tx) {
        //     tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
        //         let len = results.rows.length;
        //         for (let i = 0; i < len; i++) {
        //             let rowData = results.rows.item(i);
        //             WebUtils.log("Database.test() - id:{0},log:{1}".format(rowData.id, rowData.log));
        //         }
        //     }, null);
        // });

        let queryJson = {};
        queryJson["stmt"] = "select log from LOGS where id = ?";
        queryJson["values"] = [1];
        Database.query(JSON.stringify(queryJson));
    }

    //----------File--------------
    static _getDocumentPath(name) {
        return name;
    }

    static _getAllFiles(fcn) {
        let queryJson = {};
        queryJson["stmt"] = "SELECT NAME FROM USERFILES";
        queryJson["values"] = [];
        Database._queryData(JSON.stringify(queryJson), function (listUserFiles) {
            let allFiles = [];
            if (listUserFiles == null) {
                Database._fcnF(fcn, allFiles);
                return;
            }

            let dictData = null;
            for (let i = 0; i < listUserFiles.length; i++) {
                dictData = listUserFiles[i];
                allFiles.push(dictData.NAME);
            }
            Database._fcnF(fcn, allFiles);
        });
    }

    static _hasFile(filename, fcn) {
        Database._getAllFiles(function (allFiles) {
            for (let i = 0; i < allFiles.length; i++) {
                if (allFiles[i] == filename) {
                    Database._fcnF(fcn, true);
                    return;
                }
            }
            Database._fcnF(fcn, false);
        });
    }

    static _getFilesType(ft, fcn) {
        Database._getAllFiles(function (allFiles) {
            let array = [];
            for (let i = 0; i < allFiles.length; i++) {
                if (allFiles[i].endsWith(ft))
                    array.push(allFiles[i]);
            }
            Database._fcnF(fcn, array);
        });
    }

    static _writeToURL(url, plaindata, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database._writeToURL({0})".format(url));
        Database._hasFile(url, function (bHas) {
            let queryJson = {};
            if (bHas)
                queryJson["stmt"] = "UPDATE USERFILES SET CONTEXT = ? WHERE NAME = ?";
            else
                queryJson["stmt"] = "INSERT INTO USERFILES (CONTEXT,NAME) VALUES (?, ?)";
            queryJson["values"] = [plaindata, url];
            Database._stmtBool(JSON.stringify(queryJson), function (ok) {
                let re = (!ok) ? "-1" : url;
                Database._fcnF(fcn, re);
            });
        });
    }

    static _initWithContentsOfURL(url, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database._initWithContentsOfURL({0})".format(url));
        Database._hasFile(url, function (bHas) {
            if (!bHas) {
                Database._fcnF(fcn, null);
                return;
            }

            let queryJson = {};
            queryJson["stmt"] = "SELECT CONTEXT FROM USERFILES WHERE NAME = ?";
            queryJson["values"] = [url];
            Database._queryData(JSON.stringify(queryJson), function (listData) {
                if (listData == null) {
                    Database._fcnF(fcn, null);
                    return;
                } else if (listData.length == 0) {
                    Database._fcnF(fcn, null);
                    return;
                }

                let strContent = listData[0].CONTEXT;
                Database._fcnF(fcn, strContent);
            });
        });
    }

    static cleanassets(fileType, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.cleanassets({0})".format(fileType));
        Database._fcnF(fcn, "1");
    }

    static getmedia(file, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.getmedia({0},{1})".format(file, key));
        Database.getfile(file, function (strData) {
            if (strData == null) {
                Database._fcnF(fcn, "");
                return;
            }
            Database._fcnF(fcn, strData);
        });
    }

    static getMD5(str) {
        return WebUtils.io_getmd5(str);
    }

    static removeFile(str, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.removeFile({0})".format(str));
        Database._hasFile(str, function (bHas) {
            if (!bHas) {
                if (window.Settings.enableLog)
                    WebUtils.log("Database.removeFile({0}),File not exist!".format(str));
                Database._fcnF(fcn, -2);
                return;
            }

            let queryJson = {};
            queryJson["stmt"] = "DELETE FROM USERFILES WHERE NAME = ?";
            queryJson["values"] = [str];
            Database._stmtBool(JSON.stringify(queryJson), function (ok) {
                Database._fcnF(fcn, ok);
            });
        });
    }

    static removeAllFiles(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.removeAllFiles()");
        let queryJson = {};
        queryJson["stmt"] = "DELETE FROM USERFILES";
        queryJson["values"] = [];
        Database._stmtBool(JSON.stringify(queryJson), function (ok) {
            Database._fcnF(fcn, ok);
        });
    }

    static setfile(md5, contents, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.setfile({0},{1})".format(md5, contents));
        let url = Database._getDocumentPath(md5);
        let plaindata = WebUtils.decodeBase64(contents);
        Database._writeToURL(url, plaindata, function (ok) {
            let re = (!ok) ? "-1" : md5;
            Database._fcnF(fcn, re);
        });
    }

    static getfile(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.getfile({0})".format(filename));
        let url = Database._getDocumentPath(filename);
        Database._initWithContentsOfURL(url, function (data) {
            if (data == null) {
                Database._fcnF(fcn, null);
                return;
            }
            let strData = WebUtils.encodeBase64(data);
            Database._fcnF(fcn, strData);
        });
    }

    static writefile(filename, contents, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.writefile({0},{1})".format(filename, contents));
        let url = Database._getDocumentPath(filename);
        let plaindata = WebUtils.decodeBase64(contents);
        Database._writeToURL(url, plaindata, function (ok) {
            let re = (!ok) ? "-1" : filename;
            Database._fcnF(fcn, re);
        });
    }
}
