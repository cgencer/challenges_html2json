const searchTerm = "gold"
let result = []

function getEachItem(object) {
  object.forEach(item => {
    searchItem(item)
  })
  let uniqueResults = [...new Set(result)]
  return uniqueResults.length
};

function searchItem(item) {
  Object.keys(item).forEach(key => {
    if (typeof item[key] === "object") {
      searchItem(item[key])
    }
    if (typeof item[key] === "string") {
      let searchAsRegEx = new RegExp(searchTerm, "gi");
      if (item[key].match(searchAsRegEx)) {
        result.push(item.id)
      }
    }
  })
}