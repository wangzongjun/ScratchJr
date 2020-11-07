import WebUtils from './WebUtils';
import Web from './Web';
import localforage from 'localforage'
import {
    getSQLData,
    isEmptyOrSpaces
} from './WebSQLMatch';

import {
    ExecWebForageSQL
} from './WebForageSQL';

export default class WebForage {
    constructor(userName) {
        this.userName = userName;
        this.tables = {};

        this.tableDes = {};
        //数据表中非【TEXT】类型数据项的描述
        this.tableDes["projects"] = {
            PRIMARY: "id",
            CTIME: {
                TYPE: "DATETIME"
            },
            MTIME: {
                TYPE: "DATETIME"
            },
            POS: {
                TYPE: "INTEGER"
            },
            ISGIFT: {
                TYPE: "INTEGER",
                DEFAULT: 0
            },
        };
        this.tableDes["usershapes"] = {
            PRIMARY: "id",
            CTIME: {
                TYPE: "DATETIME"
            }
        };
        this.tableDes["userbkgs"] = {
            PRIMARY: "id",
            CTIME: {
                TYPE: "DATETIME"
            }
        };
        this.tableDes["userfiles"] = {
            PRIMARY: "name"
        };
        this.tableDes["test"] = {
            PRIMARY: "id"
        };

        this.initTables(this.tableDes);
    }

    initTables(listTable) {
        for (var tableName in listTable) {
            let forageName = this.userName + tableName;
            this.tables[tableName] = localforage.createInstance({
                name: forageName
            });
        }
    }

    close(str) {

    }
    getLocalforage(tableName) {
        let localforage = this.tables[tableName];
        return localforage;
    }

    getTableDes(tableName) {
        let tableDes = this.tableDes[tableName];
        return tableDes;
    }

    getTablePrimary(tableName) {
        let tableDes = this.getTableDes(tableName);
        if (tableDes == null)
            return;
        return tableDes["PRIMARY"];
    }

    initTableDefault(tableName, key, obj) {
        let tableDes = this.getTableDes(tableName);
        if (tableDes == null)
            return;

        let columnLow = null,
            columnDef = null,
            columnPrimary = null;
        for (var column in tableDes) {
            columnLow = column.toLowerCase();
            columnDef = tableDes[column];
            if (column == "PRIMARY") {
                //主键设置
                columnPrimary = columnDef;
                if (obj[columnPrimary] == null && !isEmptyOrSpaces(key))
                    obj[columnPrimary] = key;
                continue;
            }

            //检查默认值是否设置
            if (columnDef.DEFAULT != null) {
                if (obj[columnLow] == null)
                    obj[columnLow] = columnDef.DEFAULT;
            }
            //数据类型检查

        }
    }

    containDict(tableName, dictSub, dictAll) {
        let valueSub = null,
            valueAll = null;
        for (let keySub in dictSub) {
            valueSub = dictSub[keySub];
            valueAll = dictAll[keySub];
            //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
            if (valueSub != valueAll)
                return false;
        }
        return true;
    }

    setItem(tableName, key, obj, fcn) {
        let localforage = this.getLocalforage(tableName);
        if (localforage == null) {
            fcn(-1, null);
            return;
        }
        this.initTableDefault(tableName, key, obj);
        localforage.setItem(key, obj).then(function (value) {
            //WebUtils.log("WebForage.setItem({0},{1}),success.".format(tableName, key));
            fcn(0, value);
        }).catch(function (err) {
            WebUtils.log("WebForage.setItem({0},{1}),Error:{2}!".format(tableName, key, err));
            fcn(-2, null);
        });
    }

    updateItem(tableName, key, obj, fcn) {
        let _this = this;

        function getItemBack(nRe, oldObj) {
            if (nRe == 0) {
                if (oldObj == null)
                    oldObj = {};
                for (let key in obj) {
                    oldObj[key] = obj[key];
                }
                _this.setItem(tableName, key, oldObj, fcn);
            } else {
                fcn(-2, null);
            }
        }
        _this.getItem(tableName, key, getItemBack);
    }

    getItem(tableName, key, fcn) {
        let localforage = this.getLocalforage(tableName);
        if (localforage == null) {
            fcn(-1, null);
            return;
        }

        localforage.getItem(key).then(function (value) {
            //WebUtils.log("WebForage.getItem({0},{1}),success.".format(tableName, key));
            fcn(0, value);
        }).catch(function (err) {
            WebUtils.log("WebForage.getItem({0},{1}),Error:{2}!".format(tableName, key, err));
            fcn(-2, null);
        });
    }

    deleteItem(tableName, key, fcn) {
        let localforage = this.getLocalforage(tableName);
        if (localforage == null) {
            fcn(-1, null);
            return;
        }

        localforage.removeItem(key).then(function () {
            //WebUtils.log("WebForage.deleteItem({0},{1}),success.".format(tableName, key));
            fcn(0, null);
        }).catch(function (err) {
            WebUtils.log("WebForage.deleteItem({0},{1}),Error:{2}!".format(tableName, key, err));
            fcn(-2, null);
        });
    }

    getAllItems(tableName, fcn) {
        let localforage = this.getLocalforage(tableName);
        if (localforage == null) {
            fcn(-1, null);
            return;
        }

        let allItems = [];
        localforage.iterate(function (value, key, iterationNumber) {
            //WebUtils.log("WebForage.getAllItems({0}),iterate:{1}.".format(tableName, iterationNumber));
            allItems.push(value);
        }).then(function (result) {
            //WebUtils.log("WebForage.getAllItems({0}),success.".format(tableName));
            fcn(0, allItems);
        }).catch(function (err) {
            WebUtils.log("WebForage.getAllItems({0}),Error:{1}!".format(tableName, err));
            fcn(-2, null);
        });
    }

    deleteAllItems(tableName, fcn) {
        let localforage = this.getLocalforage(tableName);
        if (localforage == null) {
            fcn(-1, null);
            return;
        }

        localforage.clear().then(function () {
            //WebUtils.log("WebForage.deleteAllItems({0}),success.".format(tableName));
            fcn(0, null);
        }).catch(function (err) {
            WebUtils.log("WebForage.deleteAllItems({0}),Error:{1}!".format(tableName, err));
            fcn(-2, null);
        });
    }

    //re 0:表示成功 其他表示：Error
    static _fcnF(fcn, re, data = null) {
        WebUtils._fcnF(fcn, re, data);
    }

    //成功返回true，失败返回null
    stmt(body, fcn) {
        function execBack(nRe, obj) {
            if (nRe == 0) {
                if (typeof (obj) === 'string')
                    WebForage._fcnF(fcn, obj);
                else
                    WebForage._fcnF(fcn, true);
            } else
                WebForage._fcnF(fcn, null);
        };
        this.exec(body, execBack);
    }

    //成功返回true，失败返回false
    _stmtBool(body, fcn) {
        function execBack(nRe, obj) {
            if (nRe == 0)
                WebForage._fcnF(fcn, true);
            else
                WebForage._fcnF(fcn, false);
        };
        this.exec(body, execBack);
    }

    //成功返回数据列表，失败返回null
    _queryData(body, fcn) {
        function execBack(nRe, listData) {
            if (nRe == 0)
                WebForage._fcnF(fcn, listData);
            else
                WebForage._fcnF(fcn, null);
        };
        this.exec(body, execBack);
    }

    exec(body, fcn) {
        let jsonData = JSON.parse(body);
        let strSQL = jsonData["stmt"];
        let values = jsonData["values"];
        let sqlData = getSQLData(strSQL, values, false);
        ExecWebForageSQL(sqlData, this, fcn);
    }
}
