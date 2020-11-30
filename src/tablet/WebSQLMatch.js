class SQLMatch {
    constructor(SQLKey) {
        this.SQLKey = SQLKey;
        this.SepKey = ",";
    }

    isMatch(strSQL) {
        if (!strSQL.startsWith(this.SQLKey))
            return false;
        return true;
    }

    _matchObject(strSQL, listKey, values) {
        let dictObj = {};
        for (let index = 0; index < listKey.length; index++) {
            let strKey = listKey[index];
            dictObj[strKey] = values[index];
        }
        return dictObj;
    }
}

class SQLSelect extends SQLMatch {
    constructor() {
        super("select");
    }

    match(strSQL, values) {
        let patt1 = /select[\s+\n+]+([a-zA-Z0-9,\*]*)+[\s+\n+]+from+[\s+\n+]+([a-zA-Z0-9,]*)/;
        let arr = strSQL.match(patt1);
        if (arr == null || arr.length < 3)
            return null;
        let dict = {};
        dict["KEY"] = arr[1].split(this.SepKey);
        dict["TABLE"] = arr[2].trim();
        dict["SQL"] = this.SQLKey;

        let sqlOrderBy = new SQLOrderBy();
        if (sqlOrderBy.isMatch(strSQL)) {
            let listData = sqlOrderBy.match(strSQL);
            if (listData != null)
                dict["ORDERBY"] = listData;
        }
        return dict;
    }
}

class SQLInsert extends SQLMatch {
    constructor() {
        super("insert");
    }

    match(strSQL, values) {
        let patt1 = /insert[\s+\n+]+into[\s+\n+]+(\S+[\s*\n*]*)\(([\S*\s*\n*]+)\)[\s*\n*]/;
        let arr = strSQL.match(patt1);
        if (arr == null || arr.length < 3)
            return null;
        let dict = {};
        dict["TABLE"] = arr[1].trim();
        dict["KEY"] = arr[2].split(this.SepKey);
        dict["SQL"] = this.SQLKey;
        dict["OBJ"] = this._matchObject(strSQL, dict["KEY"], values);
        return dict;
    }
}

class SQLUpdate extends SQLMatch {
    constructor() {
        super("update");
    }

    match(strSQL, values) {
        let patt1 = /update[\s+\n+]+(\S+[\s*\n*]*)/;
        let arr = strSQL.match(patt1);
        if (arr == null || arr.length < 2)
            return null;

        let sqlSet = new SQLSet();
        if (!sqlSet.isMatch(strSQL))
            return null;
        let listData = sqlSet.match(strSQL);
        if (listData == null)
            return null;

        let dict = {};
        dict["TABLE"] = arr[1].trim();
        dict["SQL"] = this.SQLKey;
        dict["KEY"] = [];
        for (let index = 0; index < listData.length; index++) {
            dict["KEY"].push(listData[index]["key"]);
        }
        dict["OBJ"] = sqlSet.matchObject(strSQL, values);
        return dict;
    }
}

class SQLDelete extends SQLMatch {
    constructor() {
        super("delete");
    }

    match(strSQL, values) {
        let patt1 = /delete[\s+\n+]+from[\s+\n+]+(\S+[\s*\n*]*)+(where?)/
        let arr = strSQL.match(patt1);
        if (arr == null || arr.length < 2)
            return null;
        let dict = {};
        dict["TABLE"] = arr[1].trim();
        dict["SQL"] = this.SQLKey;
        return dict;
    }
}

//----------------------------Cond---------------------------------------
let conEndKeys = [" where ", " order by ", " set "];
class SQLMatchCond extends SQLMatch {
    constructor(SQLKey) {
        super(SQLKey);
    }

    isMatch(strSQL) {
        let indexOfFirst = this.startIndex(strSQL);
        if (indexOfFirst == -1)
            return false;
        return true;
    }

    getRegexp() {
        return null;
    }

    startIndex(strSQL) {
        return strSQL.indexOf(this.SQLKey);
    }

    endIndex(strSQL) {
        let end = strSQL.length;
        let start = this.startIndex(strSQL);
        if (start == -1)
            return end;

        start += this.SQLKey.length;
        let index = -1;
        for (let i = 0; i < conEndKeys.length; i++) {
            index = strSQL.indexOf(conEndKeys[i],start);
            if (index == -1)
                continue;
            if (index < end)
                end = index;
        }
        return end;
    }

    match(strSQL) {
        let indexOfFirst = this.startIndex(strSQL);
        if (indexOfFirst == -1)
            return null;
        indexOfFirst += this.SQLKey.length;
        let indexMatchEnd = this.endIndex(strSQL);
        let str = strSQL.substring(indexOfFirst, indexMatchEnd);
        let regexp = this.getRegexp();

        let matchList = [];
        let match;
        while ((match = regexp.exec(str)) !== null) {
            let dictMatch = {};
            dictMatch["key"] = match[1];
            dictMatch["value"] = match[2];
            dictMatch["start"] = match.index + indexOfFirst;
            dictMatch["end"] = regexp.lastIndex + indexOfFirst;
            matchList.push(dictMatch);
        }
        if (matchList.length == 0)
            return null;
        return matchList;
    }

    matchObject(strSQL, values) {
        let listData = this.match(strSQL);
        return _CondDict(strSQL, listData, values);
    }
}

//where deleted = ? AND version = ? AND gallery IS NULL order by ctime desc
class SQLWhere extends SQLMatchCond {
    constructor() {
        super(" where ");
    }

    getRegexp() {
        return /[\s]*([a-zA-Z0-9]+)[\s]*=[\s]([\?|\S]*)/g;
    }
}

//where deleted = ? AND version = ? AND gallery IS NULL order by ctime desc
class SQLOrderBy extends SQLMatchCond {
    constructor() {
        super(" order by ");
    }

    getRegexp() {
        return /[\s]*([a-zA-Z0-9]+)[\s]*(desc|asc)/g;
    }
}

//set version = ?,deleted = ?
class SQLSet extends SQLMatchCond {
    constructor() {
        super(" set ");
    }

    getRegexp() {
        return /[\s]*([a-zA-Z0-9]+)[\s]*=[\s]([\?|[\S]]*)/g;
    }
}

//----------------------------Fun---------------------------------------
function _SubStringCount(strSQL, dictMatch) {
    let nCount = dictMatch["start"];
    let startString = strSQL.substring(0, nCount - 1);
    let nIndex = (startString.match(/\?/g) || []).length;
    return nIndex;
}

function _CondDict(strSQL, listData, values) {
    let dict = {};
    let strKey = null,
        dictMatch = null;
    for (let index = 0; index < listData.length; index++) {
        dictMatch = listData[index];
        strKey = dictMatch.key;
        if (dictMatch.value == "?") {
            let valueIndex = _SubStringCount(strSQL, dictMatch);
            dict[strKey] = values[valueIndex];
        } else {
            dict[strKey] = dictMatch.value;
        }
    }
    return dict;
}

export function getSQLData(strSQL, values, bDebug = false) {
    let dictData = null;
    let listMatch = [new SQLSelect(), new SQLInsert(), new SQLUpdate(), new SQLDelete()];
    let sqlMatch = null;
    for (let index = 0; index < listMatch.length; index++) {
        sqlMatch = listMatch[index];
        if (sqlMatch.isMatch(strSQL)) {
            dictData = sqlMatch.match(strSQL, values);
            if (bDebug) {
                console.log(strSQL + " ------> " + JSON.stringify(dictData));
            }
            break;
        }
    }

    if (dictData == null)
        return null;

    sqlMatch = new SQLWhere();
    if (sqlMatch.isMatch(strSQL)) {
        let dictObj = sqlMatch.matchObject(strSQL, values);
        if (bDebug)
            console.log(strSQL + " -where-> \"" + JSON.stringify(dictObj) + "\"");
        dictData["WHERE"] = dictObj;
    }
    return dictData;
}

//https://stackoverflow.com/questions/10232366/how-to-check-if-a-variable-is-null-or-empty-string-or-all-whitespace-in-javascri
export function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

//https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
