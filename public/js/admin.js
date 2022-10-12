// import axios from 'axios';

// function initAdmin() {
const userTableBody = document.querySelector('#user-table-body');
let users = []
let markup

axios.get('/admin/home', {
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    }
}).then(res => {
    users = res.data
    markup = generateMarkup(users)
    userTableBody.innerHTML = markup
}).catch(err => {
    console.log(err);

})

function formatDate(date) {
    console.log(moment(date).format('LLL'));
    return moment(date).format('LLL');
}

function generateMarkup(users) {
    return users.map((user, idx) => {

        return `
            <tr class="bg-white">
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${idx+1}
            </td>
            <td id="title" class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${user.email}
            </td>


            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${user._id}
            </td>

            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                ${formatDate(user.createdAt)}
            </td>
            <td class="whitespace-nowrap p-3 text-sm text-gray-700">
                <form action="/admin/blocked/${user._id} " method="POST" class="flex items-center justify-center">
                    <button type="submit" class="bg-red-600 text-white py-1 px-2 rounded-md hover:scale-125 transition-all ease-in duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  
                    </button>
                </form>
            </td>
        </tr>
        
            `

    }).join('');
}
// }
// initAdmin();
//socket
let socket = io()
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')
}

socket.on('userRegistered', (user) => {

    users.unshift(user);
    userTableBody.innerHTML = ''
    userTableBody.innerHTML = generateMarkup(users);

})