const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const DataBase1 = require("../../Schemas/Tickets/ticketSchema.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Sends the ticket panel!")
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
          "Ticket system is disabled!, You can enable it by running the command `/ticket`"
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
      if (JSON.stringify(data.Types) === "[]")
        return interaction.reply({
          content:
            "Please create a query for the ticket system, Run the command `/ticket-add-query`",
          ephemeral: true,
        });

      const panelEmbed = new EmbedBuilder()
        .setDescription(data.TicketDescription)
        .setColor("Aqua");

      const options = data.Types.map((x) => {
        return {
          label: x.name,
          value: x.name,
          description: x.description,
        };
      });

      const menuComponents = [
        new ActionRowBuilder().addComponents(
          new SelectMenuBuilder()
            .setCustomId("ticket")
            .setMaxValues(1)
            .addOptions(options)
        ),
      ];

      interaction.channel.send({ embeds: [panelEmbed], components: menuComponents });

      return interaction.reply({
        content: "Succesfully sent your ticket panel..",
        ephemeral: true,
      });
    }
  },
};
