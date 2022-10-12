function spam() {
    const spamTableBody = document.querySelector('#spam-table-body');
    let stories = []
    let markup

    axios.get('/admin/story', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        stories = res.data
        markup = generateMarkup(stories)
        spamTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err);
    })

    function renderSpam(items) {
        console.log(items);
        // items.forEach(item => {
        //     console.log(item.spamBy);
        // });
        return items.map((item) => {
            // console.log(item);

            return `<p>${item.spamBy}</p>`
        }).join('');
    }

    function generateMarkup(stories) {

        return stories.map((story, idx) => {

            return `
            <tr class="bg-white">
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${idx+1}
            </td>
            <td id="title" class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${story.user.email}
            </td>


            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${story._id}
            </td>

            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                <div>${renderSpam(story.spam)}</div>
            </td>
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                <form action="/delete/${story._id}?_method=DELETE" method="POST">
                    <button type="submit" class="bg-red-600 text-white py-1 px-2 rounded-md hover:scale-125 transition-all ease-in duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </form>
            </td>
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                <a href="/posts/${story._id}" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                </a>
                
            </td>
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                <form action="/admin/posts/notspam/${story._id}" method="POST">
                    <button type="submit" class="bg-green-600 text-white py-1 px-2 rounded-md hover:scale-125 transition-all ease-in duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </form>
            </td>
        </tr>
        
            `

        }).join('');
    }

    //socket
    let socket = io()
    let adminAreaPath = window.location.pathname;

    if (adminAreaPath.includes('admin')) {
        socket.emit('join', 'spamRoom')
    }
    socket.on('spamStory', (story) => {
        console.log(story);
        console.log(story.user);
        stories.push(story);
        spamTableBody.innerHTML = ''
        spamTableBody.innerHTML = generateMarkup(stories);
        spamTableBody.innerHTML = generateMarkup(stories);

    });
}
spam();