# Forms

Work in progress

## File uploads

When making requests or form submissions that include files, Wreathe will automatically convert the request data into a `FormData` object.

For a more thorough discussion of file uploads, please consult the [file uploads](/guide/basic-usage/file-uploads) documentation.

## XHR / fetch submissions

Using Wreathe to submit forms works great for the vast majority of situations; however, in the event that you need more control over the form submission, you're free to make plain XHR or `fetch` requests instead using the library of your choice.
