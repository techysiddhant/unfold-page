const formaddstory = document.getElementById('form-addstory');
const title = document.getElementById('title');
const titleError = document.querySelector('.error.title');
const storybody = document.getElementById('storybody');
const status = document.getElementById('status');

formaddstory.addEventListener('submit', async(e) => {
    e.preventDefault();
    titleError.textContent = '';
    const res = await fetch('/add/story', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            title: title.value,

        })
    });
    const data = await res.json();
    console.log("🚀 ~ file: addstory.ejs ~ line 56 ~ formaddstory.addEventListener ~ data", data.errors)

    if (data.errors) {
        titleError.textContent = data.errors.title;
    }



})