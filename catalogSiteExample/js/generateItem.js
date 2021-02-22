function generateCol(item, sub_theme_label, subTemColor) {
  var colTemp = document.getElementById("col_template");
  var itemContent = colTemp.content.querySelector("a");
  var itemCopy = itemContent.cloneNode(true);

  if(item["link"]!=="")
  {
	itemCopy.href = "Item.html?" + item["link"];
	itemCopy.target="_blank"; 
  }

  
  
  itemCopy.getElementsByTagName("p")[1].textContent = item["title"];
  itemCopy.getElementsByTagName("p")[0].textContent = sub_theme_label;
  itemCopy.getElementsByTagName("p")[0].style.background = subTemColor;
  itemCopy.getElementsByTagName("img")[0].src=item["img"];
  return itemCopy;
}

function generateRow(cat, _themIndex) {
	var rowTemp = document.getElementById("row_template");
	var rowContent = rowTemp.content.querySelector("div");
	var rowCopy = rowContent.cloneNode(true);
	rowCopy.getElementsByTagName("h1")[0].textContent = cat["theme"];

	var _ifHaveSubTheme = true;
	for (var j = 0; j < cat["subThemes"].length; j++) {
		 var current_sub_theme = cat["subThemes"][j];
		 if(current_sub_theme["theme2"] === cat["theme"])
		 {
			_ifHaveSubTheme = false;
			break;
		 }
	 }

	if(_ifHaveSubTheme)
		rowCopy.getElementsByTagName("h4")[0].getElementsByTagName("a")[0].href="Them.html?"+ _themIndex;
	else
		rowCopy.getElementsByTagName("h4")[0].getElementsByTagName("a")[0].href="subThem.html?"+ _themIndex + "?0";
	
	var count = 0;

	for(var j = 0;  j < cat["subThemes"].length && count<3; j++)
	{
	  var subTemLabel = cat["subThemes"][j]["theme2"];
	  var subTemColor = cat["subThemes"][j]["subTehmeColor"];
	  var i;
	  for (i = 0; i < cat["subThemes"][j]["items"].length && count<3; i++) {
		  count++;
		rowCopy.appendChild(generateCol(cat["subThemes"][j]["items"][i], subTemLabel, subTemColor));
	  }
	}



	return rowCopy;
}

function generateCats(cats){
	var catsContent = document.getElementById("cats");

	var i;
	for (i = 0; i < cats.length; i++) {
		catsContent.appendChild(generateRow(cats[i], i));
	}
}

function generateDropDownList(cats)
{
	var themesDroplistContent = document.getElementById("theme_dropdown");
	var compDroplistContent = document.getElementById("comp_dropdown");

    var themeDropDowns = "";

	for (var i = 0; i < cats.length; i++) {
		var current_theme = cats[i];
		var _themeHTML = "";
		var _ifHaveSubTheme = true;
		
		for (var j = 0; j < current_theme["subThemes"].length; j++) {
			 var current_sub_theme = current_theme["subThemes"][j];
			 if(current_sub_theme["theme2"] === current_theme["theme"])
			 {
				_ifHaveSubTheme = false;
				break;
			 }
		 }
		
		if(_ifHaveSubTheme)
		{
			_themeHTML = _themeHTML.concat("<li><a href=\"Them.html?" + i + "\" ><b>" + current_theme["theme"] +"</b></a>");
			_themeHTML = _themeHTML.concat("<ul class=\"third-nav\">");

			for (var j = 0; j < current_theme["subThemes"].length; j++) {
				 var current_sub_theme = current_theme["subThemes"][j];
				 if(current_sub_theme["theme2"] !== current_theme["theme"])
				 {
					 _themeHTML = _themeHTML.concat("<li><a href=\"subThem.html?" + i + "?" + j + " \" > " + current_sub_theme["theme2"] +"</a></li>");
				 }
			 }
			 _themeHTML = _themeHTML.concat("</ul></li>");
		}
		else{
			_themeHTML = _themeHTML.concat("<li><a href=\"subThem.html?" + i + "?0\" ><b>" + current_theme["theme"] +"</b></a>");
		}
		 themeDropDowns = themeDropDowns.concat(_themeHTML);
	}

	themesDroplistContent.innerHTML = themeDropDowns;
}


function generateSubThemItmes(_thems)
{
	var _themeIndex = document.URL.split('?')[1];
	var _subThemeIndex = document.URL.split('?')[2];

	var _theme = _thems[_themeIndex];
	var _subTheme = _theme["subThemes"][_subThemeIndex];


	var _catsContent = document.getElementById("cats");

	var _innerContent = "";
	_innerContent = _innerContent.concat("<div class=\"cat_title\"><h3>Accueil / "+_theme["theme"]+"</h3><h1>"+_subTheme["theme2"] +"</h1></div>");
	for(var _i = 0;   _i< _subTheme["items"].length; )
	{

		_innerContent = _innerContent.concat("<div class=\"row\">");
		for(var _j = 0;   _j< 3 && _i< _subTheme["items"].length; _j++, _i++)
		{
			var _item = _subTheme["items"][_i];
			_innerContent = _innerContent.concat("<a class=\"column\" ");
			if(_item["link"]!=="")
			{
				_innerContent = _innerContent.concat(" href=\"Item.html?"+_item["link"]+"\" target=\"_blank\"");
			}
			_innerContent = _innerContent.concat("><img class=\"item_img\" src=\"" + _item["img"] + "\"><p class=\"subtheme_title\" style=\"background:" +_subTheme["subTehmeColor"]+"\">"+ _subTheme["theme2"] + "</p><p class=\"item_title\" >" + _item["title"] + "</p></a>");

		}
		_innerContent = _innerContent.concat("</div>");
	}

	_catsContent.innerHTML = _innerContent;
}

function generateThemItmes(_thems)
{
	var _themeIndex = document.URL.split('?')[1];

	var _theme = _thems[_themeIndex];
	var _innerContent = "";
	_innerContent = _innerContent.concat("<div class=\"cat_title\"><h3>Accueil / "+_theme["theme"]+"</h3></div>");


	for(var _k = 0;   _k< _theme["subThemes"].length; _k++)
	{
		var _subTheme = _theme["subThemes"][_k];
		_innerContent = _innerContent.concat("<div class=\"row\"><h1>" +_subTheme["theme2"] + "</h1><h4 class=\"link\" target=\"_blank\"><a href=\"subThem.html?" +_themeIndex +"?" +_k +"\">TOUT VOIR</a></h4>");

		var _catsContent = document.getElementById("cats");

		for(var _i = 0;   _i< _subTheme["items"].length && _i<3; _i++ )
		{

			var _item = _subTheme["items"][_i];
			_innerContent = _innerContent.concat("<a class=\"column\" ");
			if(_item["link"]!=="")
			{
				_innerContent = _innerContent.concat(" href=\"Item.html?"+_item["link"]+"\" target=\"_blank\"");
			}
			_innerContent = _innerContent.concat("><img class=\"item_img\" src=\"" + _item["img"] + "\"><p class=\"subtheme_title\" style=\"background:" +_subTheme["subTehmeColor"]+"\">"+ _subTheme["theme2"] + "</p><p class=\"item_title\" >" + _item["title"] + "</p></a>");


		}
		_innerContent = _innerContent.concat("</div>");
	}

	_catsContent.innerHTML = _innerContent;
}
