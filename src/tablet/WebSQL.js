import WebUtils from './WebUtils';
import WebForage from './WebForage'

export default class WebSQL {
    constructor(body) {
        this.dataBase = openDatabase(body, "1.0", "ScratchJr.db", 1024 * 1024, function () {});
        this.initTables();
    }

    initTables() {
        let stmt = "CREATE TABLE IF NOT EXISTS PROJECTS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MTIME DATETIME, ALTMD5 TEXT, POS INTEGER, NAME TEXT, JSON TEXT, THUMBNAIL TEXT, OWNER TEXT, GALLERY TEXT, DELETED TEXT, VERSION TEXT, ISGIFT INTEGER DEFAULT 0)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERSHAPES (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, NAME TEXT, OWNER TEXT, SCALE TEXT, VERSION TEXT)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERBKGS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, OWNER TEXT,  VERSION TEXT)";
        this._exec(stmt);
        stmt = "CREATE TABLE IF NOT EXISTS USERFILES (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, CONTEXT TEXT)";
        this._exec(stmt);
    }

    close(str) {

    }

    //re 0:表示成功 其他表示：Error
    static _fcnF(fcn, re, data = null) {
        WebUtils._fcnF(fcn, re, data);
    }

    _exec(body, fcn) {
        this.dataBase.transaction(function (tx) {
            tx.executeSql(body, [],
                function (tx, results) {
                    WebSQL._fcnF(fcn, true);
                },
                function (tx, error) {
                    WebSQL._fcnF(fcn, false);
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
    stmt(body, fcn) {
        WebForage.testMatch(body);
        let jsonData = JSON.parse(body);
        //"update db set fieldname = ?,mtime = ? where id = id"
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];

        this.dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("WebSQL.stmt({0} - success.)".format(body));
                    try {
                        WebSQL._fcnF(fcn, results.insertId);
                    } catch (error) {
                        WebSQL._fcnF(fcn, true);
                    }
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log(" WebSQL.stmt({0} - Error:{1})".format(body, error.message));
                    WebSQL._fcnF(fcn, null);
                }
            );
        });
    }

    _stmtBool(body, fcn) {
        WebForage.testMatch(body);
        let jsonData = JSON.parse(body);
        //"update db set fieldname = ?,mtime = ? where id = id"
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];

        this.dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("WebSQL._stmtBool({0} - success.)".format(body));
                    WebSQL._fcnF(fcn, true);
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("WebSQL._stmtBool({0} - Error:{1})".format(body, error.message));
                    WebSQL._fcnF(fcn, false);
                }
            );
        });
    }

    _queryData(body, fcn) {
        WebForage.testMatch(body);
        let jsonData = JSON.parse(body);
        let stmtstr = jsonData["stmt"];
        let values = jsonData["values"];
        this.dataBase.transaction(function (tx) {
            tx.executeSql(stmtstr, values,
                function (tx, results) {
                    if (window.Settings.enableLog)
                        WebUtils.log("WebSQL.queryData({0} - success.)".format(body));
                    let resArray = [];
                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let rowData = results.rows.item(i);
                        if (window.Settings.enableLog)
                            WebUtils.log("WebSQL.queryData() - results:{0})".format(JSON.stringify(rowData)));
                        resArray.push(rowData);
                    }
                    WebSQL._fcnF(fcn, resArray);
                },
                function (tx, error) {
                    if (window.Settings.enableLog)
                        WebUtils.log("WebSQL.queryData({0} - Error:{1})".format(body, error.message));
                    WebSQL._fcnF(fcn, null);
                });
        });
    }
}
