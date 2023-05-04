function setDataLayer (data) {
  if (window.dataLayer) {
    console.log(window.dataLayer, "dataLayer");
    window.dataLayer.push(data);
  } else {
    console.log("no dataLayer");
  }
}

export default {
  install: (app) => {
    app.config.globalProperties.$gtmFunction = {
      viewItemList: (itemData, listOrigin) => {
        const data = {
          event: "view_item_list",
          ecommerce: {
            view_lists: {
              item_list_id: listOrigin.id,
              item_list_name: listOrigin.name,
              items: itemData
            }
          }
        }
        setDataLayer(data)
      }
    } 
  }
}