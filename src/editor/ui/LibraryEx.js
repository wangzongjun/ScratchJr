import MediaLib from '../../tablet/MediaLib';
// 1、增加LibraryEx.js，实现如下功能：
// 	A.获取资源的分类【分类的名称】
// 	B.获取某个分类下的所有资源【为空就是所有】
// 	C.按照”关键字“搜索资源，并对每个搜索提供”评分“，按照分数的优先级排列

export default class LibraryEx {
	constructor(_MediaLib) {
		if (_MediaLib == null)
			_MediaLib = MediaLib;
		this.MediaLib = _MediaLib;
	}

	static listCategoryHas(listCategory, category) {
		let dictData = null;
		for (var i = 0; i < listCategory.length; i++) {
			dictData = listCategory[i];
			if (dictData.category == category)
				return false;
		}
		return true;
	}

	//dictData = {name:"全部",type:1}
	getCategory(type) {
		let data = (type == 'costumes') ? this.MediaLib.sprites : this.MediaLib.backgrounds;
		if (data == null)
			return null;
		let listCategory = [];
		let dictData = {};
		dictData.category = "全部";
		dictData.type = 1;
		listCategory.push(dictData);

		let category = null;
		for (var i = 0; i < data.length; i++) {
			category = data[i].category;
			if (category == null)
				continue;
			category = category.trim();
			if (category.length == 0)
				continue;
			if (LibraryEx.listCategoryHas(listCategory, category))
				continue;
			dictData = {};
			dictData.category = category;
			dictData.type = 0;
			listCategory.push(dictData);
		}
		return listCategory;
	}

	//dictData = {name:"全部",type:1}
	open(type, dictData) {
		let data = (type == 'costumes') ? this.MediaLib.sprites : this.MediaLib.backgrounds;
		if (data == null)
			return null;
		if (dictData == null)
			return data;
		if (dictData.type == 1)
			return data;

		let category = null;
		let categoryData = [];
		for (var i = 0; i < data.length; i++) {
			category = data[i].category;
			if (category == null)
				continue;
			category = category.trim();
			if (category.length == 0)
				continue;
			if (dictData.category == category)
				categoryData.push(data[i]);
		}
		return categoryData;
	}

	//0：不包含  1：包含   2：完全匹配
	static stringSearch(keyValue, seartchWord) {
		if (keyValue == null)
			return 0;
		if (seartchWord == null)
			return 0;
		keyValue = keyValue.trim();
		seartchWord = seartchWord.trim();
		if (keyValue == seartchWord)
			return 2;
		if (keyValue.includes(seartchWord))
			return 1;
		return 0;
	}

	static stringListSearch(listValue, seartchWord) {
		let nRe = 0,
			nMax = 0;
		for (let i = 0; i < listValue.length; i++) {
			nRe = LibraryEx.stringSearch(listValue[i], seartchWord);
			if (nRe >= nMax)
				nMax = nRe
		}
		return nMax;
	}

	static matchItem(itemData, keyWord) {
		let listKeyWord = keyWord.split('，');
		let matchScore = -1;
		for (let i = 0; i < listKeyWord.length; i++) {
			let scoreCount = -1;
			let scoreNow = LibraryEx.stringSearch(itemData.name, listKeyWord[i]);
			scoreCount += scoreNow * 10000;
			scoreNow = LibraryEx.stringSearch(itemData.md5, listKeyWord[i]);
			scoreCount += scoreNow * 1000;
			scoreNow = LibraryEx.stringListSearch(itemData.tags, listKeyWord[i]);
			scoreCount += scoreNow * 100;
			scoreNow = LibraryEx.stringSearch(itemData.category, listKeyWord[i]);
			scoreCount += scoreNow * 10;
			if (scoreCount >= matchScore)
				matchScore = scoreCount;
		}
		return matchScore;
	}

	seartch(type, dictData, keyWord) {
		let categoryData = this.open(type, dictData);
		keyWord = keyWord.trim();
		if (keyWord.length == 0)
			return categoryData;
		let seartchData = [];
		for (var i = 0; i < categoryData.length; i++) {
			let matchScore = LibraryEx.matchItem(categoryData[i], keyWord);
			if (matchScore > 0)
				seartchData.push(matchScore);
		}
		return seartchData;
	}
}