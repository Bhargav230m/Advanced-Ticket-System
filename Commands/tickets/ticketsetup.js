const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const DataBase1 = require("../../Schemas/Tickets/ticketSchema.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Setup ticket system in your server!")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("description")
        .setDescription("Add a description for your ticket system.")
        .setMaxLength(128)
        .setRequired(true)
    )
    .addRoleOption((options) =>
      options
        .setName("support")
        .setDescription("Add a support role for the channel!")
        .setRequired(true)
    )
    .addChannelOption((options) =>
      options
        .setName("category")
        .setDescription("Add a category for the ticket to be created!")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addChannelOption((options) =>
      options
        .setName("transcript-channel")
        .setDescription("Add a transcript channel for the ticket system!")
        .addChannelTypes(ChannelType.GuildText)
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
    const supportRole = await options.getRole("support");
    const category = await options.getChannel("category");
    const transcriptChannel = await options.getChannel("transcript-channel");

    const data = await DataBase1.findOne({ Guild: guild.id }).catch((err) => {
      console.log(err);
    });
    if (data) {
      const err1 = new EmbedBuilder()
        .setTitle("Data Found!")
        .setDescription(
          "Ticket system is already enabled!, You can disable it by running the command `ticket-disable`"
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
      const data1 = new DataBase1({
        Guild: guild.id,
        TranscriptLogChannel: transcriptChannel.id,
        CategoryID: category.id,
        SupportID: supportRole.id,
        TicketDescription: description,
        Types: [],
      });
      data1.save().catch((err) => {
        console.log(err);
      });
      const success = new EmbedBuilder()
        .setTitle("Success!")
        .setDescription("Ticket system has been successfully enabled!")
        .addFields(
          { name: "Support Role", value: `${supportRole}` },
          { name: "Channel Category", value: `${category}` },
          { name: "Transcript Channel", value: `${transcriptChannel}` },
          { name: "Ticket Description", value: `${description}` },
          { name: "Types", value: "Please run the command `/ticket-add-type`" }
        );
      interaction.reply({
        content: "Enabled Ticket System",
        embeds: [success],
        ephemeral: true
      });
      return;
    }
  },
};
