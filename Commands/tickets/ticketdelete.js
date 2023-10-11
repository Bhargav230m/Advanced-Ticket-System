const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const DataBase1 = require("../../Schemas/Tickets/ticketSchema.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-disable")
    .setDescription("Disables ticket system in your server")
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              ":x: | You don't have permission to execute this command"
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });
    }

    const data = await DataBase1.findOne({ Guild: guild.id }).catch((err) => {
      console.log(err);
    });

    if (!data) {
      const err1 = new EmbedBuilder()
        .setTitle("Data Not Found!")
        .setDescription(
          "Ticket system is already disabled!, You can enable it by running the command `/ticket`"
        )
        .setFooter({
          text: "If you think this is a mistake, Please wait for a few mins for this guilds data to be updated!",
        })
        .setColor("DarkRed")
      interaction.reply({
        content: "Uh Oh! Something went wrong",
        embeds: [err1],
        ephemeral: true,
      });
      return;
    } else {
      await DataBase1.deleteMany({ Guild: guild.id }).catch((err) => {
        console.log(err);
      });
      const success = new EmbedBuilder()
        .setTitle("Data Deleted!")
        .setDescription(
          "Ticket system has successfully been disabled!, Run `/ticket` to enable it again in the future"
        )
        .setFooter({
          text: "Advanced Ticket System by [Your Bot Name]",
        })
        .setColor("Green")
      interaction.reply({
        content: "Successfuly, Disabled the ticket system :3",
        embeds: [success],
        ephemeral: true
      });
      return;
    }
  },
};
