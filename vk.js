const easyvk = require('easyvk')
const path = require('path');
let fs = require('fs')

function hasValueDeep(json, findValue) {
    const values = Object.values(json);
    let hasValue = values.includes(String(findValue));
    values.forEach(function(value) {
        if (typeof value === "object") {
            hasValue = hasValue || hasValueDeep(value, findValue);
        }
    })
    return hasValue;
}

function write_nodes(new_node){
    var file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
    const res = hasValueDeep(file.nodes, new_node.id)
    if (res == false){
        file.nodes.push(new_node)
    }
    fs.writeFileSync('data.json', JSON.stringify(file, null, 2));
}

function write_links(new_link){
    var file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
    const res = hasValueDeep(file.links, new_link.source) && hasValueDeep(file.links, new_link.target) 
    if (res == false){
        file.links.push(new_link)
    }
    fs.writeFileSync('data.json', JSON.stringify(file, null, 2));

}

const get_info = async (ids) =>{
    let data = easyvk({
        username: '',
        password: '',
        sessionFile: path.join(__dirname, '.my-session')
        }).then(async vk => {
            let vkr = await vk.call('users.get', {
            user_ids: ids,
            fields: 'photo_200_orig, city'
        });
        return await vkr
        })
    return await data
}

async function get_info_first(ids){
    let data = await get_info(ids)
    return await data
}

let count = 0
async function get_friends(ids){
    easyvk({
    username: '',
    password: '',
    sessionFile: path.join(__dirname, '.my-session')
    }).then(async vk => {
        let vkr = await vk.call('friends.get', {
        user_id: ids,
        fields: 'photo_200_orig, city',
        order: 'name'
    });
    const self_info = await get_info_first(ids)
    node = {"id":ids, "user":self_info[0].first_name + ' ' + self_info[0].last_name, "photo":self_info[0].photo_200_orig, "count":vkr.count, city:"vkr.city"}
    console.log(node)
    write_nodes(node)
    count = vkr.count
    let i = 0
    vkr.items.forEach(element => {
        i += 1
        fullname = element.first_name + " " + element.last_name
        let id = String(element.id)
        node = {"id":id, "user":fullname, "photo":element.photo_200_orig, "city":element.city}
        link = {"source":ids,"target":id}
        console.log(i+' / '+count)
        write_nodes(node)
        write_links(link)
    });
    })
}

async function get_friends_2(ids){
    easyvk({
    username: '',
    password: '',
    sessionFile: path.join(__dirname, '.my-session')
    }).then(async vk => {
        let vkr = await vk.call('friends.get', {
        user_id: ids,
        fields: 'photo_200_orig, city',
        order: 'name'
    });
    vkr.items.forEach(element => {
        fullname = element.first_name + " " + element.last_name
        let id = String(element.id)
        node = {"id":id, "user":fullname, "photo":element.photo_200_orig, "city":element.city['title']}
        link = {"source":ids,"target":id}
        write_nodes(node)
        write_links(link)
    });
    })
}
function clear_graph(){
console.log('e')
}
