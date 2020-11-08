import {
    uuidv4
} from './WebSQLMatch';

class WebForageSQL {
    constructor(strKey) {
        this.strKey = strKey;
    }

    isMatch(sqlData) {
        if (sqlData["SQL"] != this.strKey)
            return false;
        return true;
    }

    _getObjects(sqlData, localForage, fcn) {
        let dictWhere = sqlData["WHERE"];
        let tableName = sqlData["TABLE"];
        let tablePrimary = localForage.getTablePrimary(tableName);
        let key = null;
        if (dictWhere != null)
            key = dictWhere[tablePrimary];
        if (key != null) {
            function getItemItemBack(nRe, obj) {
                if (nRe != 0) {
                    fcn(nRe, null);
                    return;
                }
                fcn(nRe, [obj]);
            }
            localForage.getItem(tableName, key, getItemItemBack);
            return;
        }

        function allItemBack(nRe, listData) {
            if (nRe != 0) {
                fcn(nRe, null);
                return;
            }
            if (dictWhere == null) {
                fcn(nRe, listData);
                return;
            }
            let listEqualData = [];
            for (let index = 0; index < listData.length; index++) {
                if (localForage.containDict(tableName, dictWhere, listData[index])) {
                    listEqualData.push(listData[index]);
                }
            }
            fcn(nRe, listEqualData);
        }
        localForage.getAllItems(tableName, allItemBack);
    }
}

class WebForageSelect extends WebForageSQL {
    constructor() {
        super("select");
    }

    exec(sqlData, localForage, fcn) {
        super._getObjects(sqlData, localForage, fcn);
    }
}

class WebForageInsert extends WebForageSQL {
    constructor() {
        super("insert");
    }

    exec(sqlData, localForage, fcn) {
        let tableName = sqlData["TABLE"];
        let tablePrimary = localForage.getTablePrimary(tableName);
        let obj = sqlData["OBJ"];
        let key = obj[tablePrimary];
        if (key == null)
            key = uuidv4();

        function setItemBack(nRe, obj) {
            if (nRe != 0) {
                fcn(nRe, null);
                return;
            }
            fcn(nRe, key);
        }
        localForage.setItem(tableName, key, obj, setItemBack);
    }
}

class WebForageUpdate extends WebForageSQL {
    constructor() {
        super("update");
    }

    exec(sqlData, localForage, fcn) {
        function getObjectBack(nRe, listData) {
            if (nRe != 0) {
                fcn(nRe, null);
                return;
            }

            if (listData == null) {
                fcn(-1, null);
                return;
            }
            let nCount = listData.length;
            if (nCount < 1) {
                fcn(-1, null);
                return;
            }

            let allItems = [];

            function updateItemBack(nRe, obj) {
                nCount--;
                if (nRe == 0)
                    allItems.push(obj);
                if (nCount == 0)
                    fcn(0, allItems);
            }

            let tableName = sqlData["TABLE"];
            let objSQL = sqlData["OBJ"];
            let tablePrimary = localForage.getTablePrimary(tableName);
            let objLocal = null,
                key = null;
            for (let index = 0; index < nCount; index++) {
                objLocal = listData[index];
                key = objLocal[tablePrimary];
                localForage.updateItem(tableName, key, objSQL, updateItemBack);
            }
        }
        super._getObjects(sqlData, localForage, getObjectBack);
    }
}

class WebForageDelete extends WebForageSQL {
    constructor() {
        super("delete");
    }

    exec(sqlData, localForage, fcn) {
        let dictWhere = sqlData["WHERE"];
        let tableName = sqlData["TABLE"];
        let tablePrimary = localForage.getTablePrimary(tableName);
        let key = null;
        if (dictWhere != null)
            key = dictWhere[tablePrimary];
        if (key != null) {
            localForage.deleteItem(tableName, key, fcn);
        } else {
            localForage.deleteAllItems(tableName, fcn);
        }
    }
}

export function ExecWebForageSQL(sqlData, localForage, fcn) {
    let listMatch = [new WebForageSelect(), new WebForageInsert(), new WebForageUpdate(), new WebForageDelete()];
    let sqlMatch = null;
    for (let index = 0; index < listMatch.length; index++) {
        sqlMatch = listMatch[index];
        if (sqlMatch.isMatch(sqlData)) {
            sqlMatch.exec(sqlData, localForage, fcn);
            return true;
        }
    }
    return false;
}