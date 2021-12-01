const { color } = require('../util')
var cron = require('node-cron');
var arr = [];

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        if (pushname == undefined || pushname.trim() == '') console.log(sender)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
        const pengirim = sender.id;
        const ownerNumber = ["62895338455177@c.us","55xxxxx"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)

        const prefix = '#'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        // const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        // const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1);
        
        const isCmd = body.startsWith(prefix)

        switch (command) {
            case 'alarm_on':
                if (!isOwner && !isGroupAdmins) return await client.reply(from, 'Hanya bisa dilakukan oleh owner atau admin grub', id)
                cron.schedule('0 0 * * *', async () => { //cron job setiap jam 12 malem
                    console.log(color('[+] Broadcasting tugas...', 'green'));
                    const allgroupzzz = await client.getAllGroups()
                    for(let gclist of allgroupzzz) {
                        if(arr.length > 0) {
                            let text = "_*Alarm List Tugas!*_ \n"
                            arr.forEach((data) => {
                                text += data.id +". Matkul "+ data.matkul +" ➤ "+ data.detail +" ➤ "+ "deadline "+ data.deadline +"\n"
                            });
                            console.log(color('[+] Tugas Broadcasted.', 'yellow'));
                            await client.sendText(gclist.contact.id, text)
                        } else {
                            console.log(color('[+] Tidak ada tugas...', 'yellow'));
                        }  
                    }
                }); 
                client.reply(from, 'Ok, Alarm is set every 00.00 PM...',id)
                break      
            case 'menu':
                const menu = "*MENU*\n1. _#tugas_ : Menampilkan list tugas\n\n2. _#add [matkul|detailTugas|deadline]_ : Menambah list tugas, contoh *#add PABW|tugas mingguan|14 desember*\n\n3. _#delete [id]_ : Menghapus Tugas, Contoh *#delete 0*\n\n4. _#about_ : tentang bot ini\n"
                const a = client.getAllGroups()
                await client.sendText(from, menu + "\n"+ a)
                break
            case 'about':
                const about = 'Bot ini dikembangkan oleh _*Informatika B1 2018*_';
                await client.sendText(from, about)
                break
            case 'tugas':
                if(isGroupMsg){
                    if(arr.length > 0) {
                        let text = "_*List Tugas*_\n"
                        arr.forEach((data) => {
                            text += "*"+ data.id +"*. Matkul "+ data.matkul +" ➤ "+ data.detail +" ➤ "+ "deadline "+ data.deadline +"\n\n"
                        });
                        await client.sendText(from, text)
                    } else {
                        let text = "_*List Tugas*_\nTidak ada tugas, gas ngechip"
                        await client.sendText(from, text)
                    }
                } else {
                    await client.sendText(from, "Hanya dapat dilakukan dalam Grup.", id)
                }
                break
            case 'add':
                if(isGroupMsg){
                    if(isGroupAdmins){
                        argz = body.trim().split('|')
                        if(argz.length === 3){
                            let a = argz[0].split(' ')
                            var no = arr.length
                            var matkul = a[1]
                            var detail = argz[1]
                            var deadline = argz[2]
                            arr.push({id: no, matkul, detail, deadline })

                            let text = "_*List Tugas*_ \n"
                            arr.forEach((data) => {
                                text += "*"+ data.id +"*. Matkul "+ data.matkul +" ➤ "+ data.detail +" ➤ "+ "deadline "+ data.deadline +"\n\n"
                            });
                            console.log(color('[+] Added new tugas', 'red'));
                            await client.sendText(from, "_Sukses menambahkan tugas_\nAwoakwoakwoa mampus")
                            await client.sendText(from, text)
                        } else {
                            await client.sendText(from, "Command anda salah, contoh command :\n*#add PABW|tugas mingguan|14 desember*")
                        }
                    } else {
                        await client.sendText(from, "*Hanya admin yg dapat menambahkan data*.")    
                    }
                }  else {
                    await client.sendText(from, "Hanya dapat dilakukan dalam Grup.")
                }
                break
            case 'delete':
                if(isGroupMsg){
                    if(isGroupAdmins){
                        argz = body.trim().split('|')
                        if(argz.length === 1){
                            const x = argz.toString().split(" ")
                            var isId = parseInt(x[1]);
                            for (let i = arr.length - 1; i>=0; --i) {
                                if (arr[i].id == isId) {
                                    let del = arr.splice(i, 1)
                                    if (del) {
                                        if(arr.length > 0) {
                                            let text = "_*Sisa List Tugas*_\n"
                                            arr.forEach((data) => {
                                                text += "*"+ data.id +"*. Matkul "+ data.matkul +" ➤ "+ data.detail +" ➤ "+ "deadline "+ data.deadline +"\n\n"
                                            });
                                            console.log(color('[+] Deleting tugas id '+isId, 'yellow'));
                                            await client.sendText(from, "Alhamdulillah\n")
                                            await client.sendText(from, text)
                                        } else {
                                            let text = "_*Sisa List Tugas*_\nOra ono, gas ngechip"
                                            await client.sendText(from, text)
                                        }           
                                    } else {
                                        await client.sendText(from, "error")
                                    }
                                }
                            }
                        } else {
                            await client.sendText(from, "Command anda salah, contoh command :\n*#delete 0*")
                        }
                    } else {
                        await client.sendText(from, "*Hanya admin yg dapat menghapus data*.")    
                    }
                }  else {
                    await client.sendText(from, "Hanya dapat dilakukan dalam Grup.")
                }
                break
            default:
                break
        }
       
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}