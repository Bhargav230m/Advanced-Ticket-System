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
    .setName("ticket-add-query")
    .setDescription("Setup ticket system in your server!")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("description")
        .setDescription("Add a description for the query.")
        .setMaxLength(128)
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("query")
        .setDescription("Add a query for your ticket system.")
        .setMaxLength(82)
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options, member } = interaction;
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
    const description = await options.getString("description");
    const query = await options.getString("query");
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
        ephemeral: true
      });
      return;
    } else {
      const type1 = {
        name: query,
        description: description,
      };
      if (data.Types.length > 18)
        return interaction.reply({
          content: "Uh Oh!, You can't have more than 18 query of tickets",
        });
      data.Types.push(type1);
      data.save().catch((err) => {
        console.log(err);
      });
      const success = new EmbedBuilder()
        .setTitle("Added a new Query")
        .setDescription(
          `Successfully added a new query to the ticket system called ${type1.name}, Now anyone can open a ticket with this query!.`
        );
      interaction.reply({
        content: "Added a new Query",
        embeds: [success],
        ephemeral: true,
      });
      return;
    }
  },
};
