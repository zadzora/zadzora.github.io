var Languages = function(game)
{
    if(Languages.instance != null)
        return Languages.instance;

    Languages.instance = this;
    Languages.instance.language = 'en';

    this.gameTextsParsed = null;
    this.xml = null;
    this.gameTextsLists = [];

    var xml = game.cache.xml.get('lang_strings');
    var document = xml.getElementsByTagName('string');
    for (var i = 0; i < document.length; i++){
        if (this.gameTextsLists[document.item(i).getAttribute("id")] == null){
            this.gameTextsLists[document.item(i).getAttribute("id")] = [];
        }

        for(var j = 0; j < LANGUAGES.length; j++)
            if (document.item(i).getElementsByTagName(LANGUAGES[j]).length >0) {
                this.gameTextsLists[document.item(i).getAttribute("id")][LANGUAGES[j]] = document.item(i).getElementsByTagName(LANGUAGES[j])[0].textContent.replace(/\\n/g, '\n');
            }
    }

};

var LANGUAGES = ["en", "de", "es", "fr", "it", "pt", "ru"];

Languages.instance = null;

Languages.prototype = {};

function Str(id)
{
    if (Languages.instance.gameTextsLists[id] == undefined || Languages.instance.gameTextsLists[id][Languages.instance.language] == undefined) {
        console.warn('STR(' + id + ') MISSING!')
        return (' ' + id.toUpperCase() + ' '); // Adding spaces at start and end
    }

    var retVal = Languages.instance.gameTextsLists[id][Languages.instance.language];
    // return retVal.replaceAll('\\n', '\n');
    retVal.replaceAll('\\n', '\n');
    return (' ' + retVal + ' '); // Adding spaces at start and end
}

function STR(id)
{
    return Str(id).toUpperCase();
}