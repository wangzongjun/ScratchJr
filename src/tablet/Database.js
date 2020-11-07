import WebUtils from './WebUtils';
import WebSQL from './WebSQL';
import WebForage from './WebForage'

let dataBase = null;
export default class Database {
    //re 0:表示成功 其他表示：Error
    static _fcnF(fcn, re, data = null) {
        WebUtils._fcnF(fcn, re, data);
    }

    static open(userName) {
        if (dataBase != null)
            return;
        if (window.Settings.enableLog)
            WebUtils.log("Database.open({0})".format(userName));
        dataBase = new WebForage(userName);
        return "0";
    }

    static close(str) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.close({0})".format(str));
        if (dataBase != null)
            dataBase.close(str);
        return "0";
    }

    static _exec(body, fcn) {
        //if (window.Settings.enableLog)
        //    WebUtils.log("Database._exec({0})".format(body));
        dataBase._exec(body, fcn);
        return "success";
    }

    static stmt(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.stmt({0})".format(body));
        dataBase.stmt(body, fcn)
    }

    static _stmtBool(body, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database._stmtBool({0})".format(body));
        dataBase._stmtBool(body, fcn);
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
        dataBase._queryData(body, fcn);
    }

    static _findDataIn(stmtstr, values, fcn) {
        let queryJson = {};
        queryJson["stmt"] = stmtstr;
        queryJson["values"] = values;
        return Database.query(JSON.stringify(queryJson), fcn);
    }

    //--------------test--------------------------
    static test() {
        if (window.Settings.enableLog)
            WebUtils.log("Database.test()");
        dataBase.test();
    }

    //----------File--------------
    static _getDocumentPath(name) {
        return name;
    }

    static _getAllFiles(fcn) {
        let queryJson = {};
        queryJson["stmt"] = "select name from userfiles";
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
                allFiles.push(dictData.name);
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
                queryJson["stmt"] = "update userfiles set context = ? where name = ?";
            else
                queryJson["stmt"] = "insert into userfiles (context,name) values (?, ?)";
                
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
            queryJson["stmt"] = "select context from userfiles where name = ?";
            queryJson["values"] = [url];
            Database._queryData(JSON.stringify(queryJson), function (listData) {
                if (listData == null) {
                    Database._fcnF(fcn, null);
                    return;
                } else if (listData.length == 0) {
                    Database._fcnF(fcn, null);
                    return;
                }

                let strContent = listData[0].context;
                Database._fcnF(fcn, strContent);
            });
        });
    }

    static cleanassets(fileType, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.cleanassets({0})".format(fileType));
        Database._fcnF(fcn, "1");
    }

    static setmedia(contents, ext, fcn) {
        let key = Database.getMD5(contents);
        let md5 = "{0}.{1}".format(key, ext);
        if (window.Settings.enableLog)
            WebUtils.log("Database.setmedia({0}) - {1}".format(ext, md5));
        Database._writeToURL(md5, contents, fcn);
    }

    static getmedia(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Database.getmedia({0})".format(filename));
        let url = Database._getDocumentPath(filename);
        Database._initWithContentsOfURL(url, function (data) {
            if (data == null) {
                Database._fcnF(fcn, null);
                return;
            }
            Database._fcnF(fcn, data);
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
            queryJson["stmt"] = "delete from userfiles where name = ?";
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
        queryJson["stmt"] = "delete from userfiles";
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
            WebUtils.log("Database.writefile({0})".format(filename));
        let url = Database._getDocumentPath(filename);
        let plaindata = WebUtils.decodeBase64(contents);
        Database._writeToURL(url, plaindata, function (ok) {
            let re = (!ok) ? "-1" : filename;
            Database._fcnF(fcn, re);
        });
    }
}
