const { Client, MessageEmbed , Intents, MessageButton, MessageActionRow, ButtonInteraction, PermissionOverwrites } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const foto = "https://media.discordapp.net/attachments/734844209839996960/1010688712818044948/Petoco_Logo.jpg";
const comandos = "1010877183021035542";
const color = "#00F7FF";

const db = require("megadb");
const DB = new db.crearDB("warns")

client.on("ready", () => {

    console.log("Bot ON, loged by " + client.user.username);

    client.user.setActivity({
        name: "Petoco Shop",
        type: "PLAYING"
    })
});

client.on("messageCreate", async ( message ) => {

    const prefix = "!";
    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if(!message.content.startsWith("!")) return;

    if(command === "avatar"){

        message.delete();
        if(message.channel.id === comandos){
            const usuario = message.mentions.users.first();

            if(!usuario){
                const embed = new MessageEmbed()
                .setTitle("Tu avatar")
                .setImage(message.member.displayAvatarURL({ dynamic: true, size: 1024}))
                .setColor(color)
                .setFooter({ text: "Sistema de Comandos | Petoco Shop"})
                .setTimestamp();
                message.channel.send({ embeds: [embed]})
            } else {
                const embed = new MessageEmbed()
                .setTitle(`El avatar de ${usuario.tag}`)
                .setImage(usuario.displayAvatarURL({ dynamic: true, size: 1024}))
                .setColor(color)
                .setFooter({ text: "Sistema de Comandos | Petoco Shop"})
                message.channel.send({ embeds: [embed]})
            }
        } else {
            message.author.send(`No puedes enviar comandos en este canal, debes enviarlos a este canal: <#${comandos}>`)
        }
    }
    if(command === "ticket"){
        message.delete();
        if(message.channel.id === "1011297013750575124"){
            message.guild.channels.create(`ticket-${message.author.username}`, { permissionOverwrites:[
                {
                    deny: "VIEW_CHANNEL",
                    id: message.guild.id
                },
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: message.author.id
                },
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                    id: "1011054538981117952"
                }
            ],
            parent: "993936004522201179"
            }).then(async (channel) => {
                const embed1 = new MessageEmbed()
                .setTitle("Tipo de ticket")
                .setColor(color)
                .setDescription(`Buenas <@${message.author.id}>, elige el tipo de ticket que quieres crear:
                
                🔨 - Soporte o Ayuda
                💸 - Comprar algun producto de la Tienda
                🌟 - Interesad@ en Partner
                🎉 - Reclamar una recompensa o un sorteo`)
                .setFooter({ text: "Sistema de Tickets | Petoco Shop"})
                channel.send({ embeds: [embed1]}).then((pog) => {
                    pog.react("🔨"),
                    pog.react("💸"),
                    pog.react("🌟"),
                    pog.react("🎉")
                })
                const embed2 = new MessageEmbed()
                .setDescription("Para cerrar el ticket utiliza el comando !cerrar")
                .setColor("RED")
                channel.send({ embeds: [embed2]})
                client.on("messageReactionAdd", async (reaction, user) => {
                    if(reaction.client.user === user) return;
    
                    if(reaction.emoji.name === "🔨"){
                        channel.edit({ name: `ayuda-${message.author.username}`, parent: "1011278445847789659"});
                        channel.send(`Has cambiado el tipo de ticket a Soporte/Ayuda, dentro de poco te atendera un <@&1011054538981117952>`)
                    }
                    if(reaction.emoji.name === "💸"){
                        channel.edit({ name: `compra-${message.author.username}`, parent: "1011278527200506017"});
                        channel.send(`Has cambiado el tipo de ticket a Compra, dentro de poco te atenedra <@528597546252369920>`)
                    }
                    if(reaction.emoji.name === "🌟"){
                        channel.edit({ name: `partner-${message.author.username}`, parent: "1011278576714256455"});
                        channel.send(`Has cambiado el tipo de ticket a Partner, dentro de poco te atendera un <@&1011279569543766067>`)
                    }
                    if(reaction.emoji.name === "🎉"){
                        channel.edit({ name: `reclamo-${message.author.username}`, parent: "1013556321401962638"});
                        channel.send(`Has cambiado el tipo de ticket a Reclamo, dentro de poco te atendera <@528597546252369920>`)
                    }
                });
            })
        }
    }
    if(command === "cerrar"){
        await message.channel.send(`Estas segur@ de cerrar el ticket?`).then((pog) => {
            pog.react("💥")
        })

        const discordTranscripts = require('discord-html-transcripts');

        const moment = require("moment");
                
        const canal = message.channel;

        const attachment = await discordTranscripts.createTranscript(canal, {
            fileName: `${canal.name}.html`,
            saveImages: true
        });


        client.on("messageReactionAdd", async (reaction, user) => {

            if(reaction.client.user === user) return;

            if(reaction.emoji.name === "💥"){

                const transcripts = client.channels.cache.get("1011283604023820399");

                const embed = new MessageEmbed()
                .setTitle("Ticket Cerrado")
                .addField("Canal:", `${canal.name}`, false)
                .addField("Categoria:", `${canal.parent}`, true)
                .addField("Fecha Cerrado:", `${moment(new Date()).format("DD/MM/YYYY")}`, true)
                .addField("Cerrado Por", `<@${message.author.id}> - ${message.author.tag}`, true)
                .setColor(color)
                .setFooter({ text: "Sistema de Tickets | Petoco Shop"})

                transcripts.send({ embeds: [embed], files: [attachment]});

                canal.delete();

            }
        })
    }
    if(command === "ban"){
        message.delete();
        if(message.member.roles.cache.some(r => r.id === "1011054538981117952")){
            const usuario = message.mentions.members.first();
            const razon = args.slice(1).join('  ');

            if(!usuario) return message.author.send("Debes mencionar a un usuario");
            if(!razon) return message.author.send("Debes dar un motivo");

            const embed = new MessageEmbed()
            .addField(`Usuario:`, `${usuario.username}`)
            .addField(`Motivo:`, `${razon}`)
            .setColor("RED")
            .setFooter({ text: "Sistema de Sanciones | Petoco Shop"})
            .setTimestamp();
            client.channels.resolve("1011378702044635136").send({ embeds: [embed]})

            usuario.ban(razon);
        }
    }
    if(command === "kick"){
        message.delete();
        if(message.member.roles.cache.some(r => r.id === "1011054538981117952")){
            const usuario = message.mentions.members.first();
            const razon = args.slice(1).join('  ');

            if(!usuario) return message.author.send("Debes mencionar a un usuario");
            if(!razon) return message.author.send("Debes dar un motivo");

            const embed = new MessageEmbed()
            .addField(`Usuario:`, `${usuario.username}`)
            .addField(`Motivo:`, `${razon}`)
            .setColor("RED")
            .setFooter({ text: "Sistema de Sanciones | Petoco Shop"})
            .setTimestamp();
            client.channels.resolve("1011380608389357658").send({ embeds: [embed]})

            usuario.kick(razon);
        }
    }
    if(command === "warn"){
        message.delete();
        if(message.member.roles.cache.some(r => r.id === "1011054538981117952")){
            const usuario = message.mentions.members.first();
            const razon = args.slice(1).join('  ');

            if(!usuario) return message.author.send("Debes mencionar a un usuario");
            if(!razon) return message.author.send("Debes dar un motivo");

            if(!DB.tiene(usuario.id, 0)){
                DB.establecer(usuario.id, 0)
            }

            DB.sumar(usuario.id, 1)

            const embed = new MessageEmbed()
            .addField(`Ususario:`, `<@${usuario.id}>`)
            .addField(`Motivo:`, `${razon}`)
            .addField(`Warns:`, `${DB.obtener(`${usuario.id}`, "-")}`)
            .setColor("RED")
            .setFooter({ text: "Sistema de Sanciones | Petoco Shop"})
            .setTimestamp();
            client.channels.resolve("1013549942016594012").send({ embeds: [embed]})
        }
    }
    if(command === "say"){
        if(message.member.roles.cache.some(r => r.id === "1011054538981117952")){
            message.delete()
            const embed = new MessageEmbed()
            .setDescription(`${args.join(' ')}`)
            .setThumbnail(foto)
            .setColor(color)
            .setFooter({ text: "Sistema de Comunicados | Petoco Shop"})
            message.channel.send({ embeds: [embed]})
        }
    }
});

client.login("OTkzOTM5NTE5OTYxMzEzMzMw.GL7Uft.tc1FXX4JMFRvxsTZe227Dl5mxJGRxWzV1fLo8A");