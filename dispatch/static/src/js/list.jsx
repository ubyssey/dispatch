var List = function(model){

    var selected = [];

    var removeFromList = function(list, item){
        var index =  list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    $('.item-checkbox').change(function(){
        var id = $(this).parent().parent().data('id');
        if(this.checked) {
            selected.push(id);
        } else {
            removeFromList(selected, id);
        }
        render();
    });

    $('.delete-items').click(function(e){
        e.preventDefault();
        dispatch.bulkRemove(model, selected, function(data){
            $.each(data.deleted, function(key, id){
                removeFromList(selected, id);
                $('#item-'+id).hide();
            });
            render();
        });
    });

    var render = function(){
        $('.selected-items').html(selected.length + " items selected");
    }

    render();

}

var list = List($('.list').data("model"));
