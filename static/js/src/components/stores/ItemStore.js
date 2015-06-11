var ItemStore = function(data){
    return {
        items: data ? data : [],
        remove: function(id){
            for(var i = 0; i < this.items.length; i++){
                if(this.items[i].id == id){
                    this.items.splice(i, 1);
                    return
                }
            }
        },
        append: function(item, key){
            if(typeof key !== undefined)
                item.id = item[key];
            this.items.push(item);
        },
        all: function(){
            return this.items;
        },
        getIds: function(){
            var ids = [];
            for(var i = 0; i < this.items.length; i++){
                ids.push(this.items[i].id);
            }
            return ids.join();
        }
    }
}

module.exports = ItemStore;