
function prepareContext(records) {
    let context = records.map(r => JSON.stringify(r.dadosJson)).join(' ');
        context = context.replaceAll("{", "");
        context = context.replaceAll("}", "");
        context = context.replace("\"", "");
        return context
}

module.exports = {prepareContext}