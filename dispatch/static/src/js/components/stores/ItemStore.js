var _ = require('lodash');

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
        prepend: function(item){
            this.items.unshift(item);
        },

        dump: function(items){
            this.items = items;
        },
        getItem: function(id){
            var i = _.findIndex(this.items, {id: id});
            return this.items[i];
        },
        update: function(id, data){
            var i = _.findIndex(this.items, {id: id});
            this.items[i] = data;
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
