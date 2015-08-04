var LinkedList = function(array){

    var Node = function(data){
        return {
            data: data,
            next: null,
            prev: null
        }
    }

    var tail = Node(array[array.length - 1]);
    for(var i = array.length - 2; i >= 0; i--){
        var prev = Node(array[i]);
        tail.prev = prev;
        prev.next = tail;
        tail = prev;
    }
    return tail;

}

module.exports = LinkedList;
