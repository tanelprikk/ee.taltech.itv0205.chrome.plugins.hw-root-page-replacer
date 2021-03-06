function buildPracticeLinks(objURL) {
  var linkTpl = objURL.protocol + objURL.root + '/' + objURL.pathParts[0] + '/{idPlaceholder}';
  return ['prax1', 'prax2', 'prax3', 'prax4', 'prax5']
    .map((practiceId) => ({
      href: linkTpl.replace('{idPlaceholder}', practiceId),
      textContent: practiceId
    }));
}

function displayFallbackContent(objURL) {
  var url = chrome.runtime.getURL('/modules/dijkstra-page/templates/fallback-page.tpl');
  fetch(url)
    .then((response) => response.text())
    .then((tplSource) => {
      var template = Handlebars.compile(tplSource);
      var context = { practiceData: buildPracticeLinks(objURL) };
      var documentContent = template(context);
      replaceContent(documentContent);
    })
    .catch((e) => console.warn(e, 'Template processing failed.'));
}

function main() {
  var objURL = getLocalURLParts();
  if (objURL.pathParts.length != 1) {
    return;
  }

  var username = objURL.pathParts[0];
  if (username.length <= 1 || !username.startsWith('~')) {
    return;
  }

/*
  // Note: would be better to check HTTPstatus, but it's a hassle
  var testNode = selectSingleNode('/html/body/h1[. ="Forbidden"]')
    || selectSingleNode('/html/body[. = "It works"]'); // <- I guess they were testing index.html
  if (!testNode) {
    return;
  }
  Commented since it's better just to overwrite (some students used the root index.html file for testing).
  Though this also allows for dijkstra.cs.ttu.ee/~[some username that does not exist]
*/

  displayFallbackContent(objURL);
}

main();
