ClassicEditor
    .create( document.querySelector( '#ticket-editor' ), {
        // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]

        mediaEmbed: {
            previewsInData: true
        }

    } )
    .then( editor => {
        window.editor = editor;
        editor.model.document.on( 'change:data', () => {
            $('#ticket-editor').val(editor.getData());
        });
    } )
    .catch( err => {
        console.error( err.stack );
    } );

