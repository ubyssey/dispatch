var Headers = function(quill, options) {

    function getCurrentLine(range){
        return quill.editor.doc.findLineAt(range.start)[0];
    }

    function updateSelected(line){
        $('.ql-header').removeClass('ql-active');
        if(line.node.nodeName == 'H1' || line.node.nodeName == 'H2' || line.node.nodeName == 'H3'){
            $('.ql-header.'+line.node.nodeName).addClass('ql-active');
        }
    }

    quill.on('selection-change', function(range){
        if(range){
            updateSelected(getCurrentLine(range));
        }
    });

    $('.ql-header').click(function(e){
        e.preventDefault();
        quill.focus();
        var range = quill.getSelection();
        var line = getCurrentLine(range);
        var size = $(this).data('size');
        line.formatHeader(size);
        updateSelected(line);
    });

};

module.exports = Headers;