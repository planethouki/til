package com.github.planethouki.mcmmolevel2pexpromote;

import java.util.List;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

import com.gmail.nossr50.mcMMO;
import com.gmail.nossr50.api.ExperienceAPI;
import com.gmail.nossr50.datatypes.database.PlayerStat;
import com.gmail.nossr50.datatypes.player.McMMOPlayer;
import com.gmail.nossr50.datatypes.skills.SkillType;
import com.gmail.nossr50.util.commands.CommandUtils;
import com.gmail.nossr50.util.player.UserManager;

import ru.tehkode.permissions.PermissionUser;
import ru.tehkode.permissions.bukkit.PermissionsEx;
import ru.tehkode.permissions.exceptions.RankingException;

public class McpexCommand implements CommandExecutor {

	McpexPlugin plugin;

	public McpexCommand(McpexPlugin plugin) {
		this.plugin = plugin;
	}

	@Override
	public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
		if (sender instanceof Player) {
			sender.sendMessage("Command Console Only");
			return false;
		}
		sender.sendMessage("McmmoCommand Start");
		for (String arg : args) {
			sender.sendMessage("arg: " + arg);
		}
		if (args.length == 0) {
			sender.sendMessage("args needed");
			return false;
		}
		switch (args[0]) {
			case "promote":
				executePex(sender, command, label, args, "promote");
				break;
			case "demote":
				executePex(sender, command, label, args, "demote");
				break;
			default:
				execute1(sender, command, label, args);
				execute2(sender, command, label, args);
				execute3(sender, command, label, args);
				break;
		}
		sender.sendMessage("McmmoCommand End");
		return true;
	}


	private boolean executePex(CommandSender sender, Command command, String label, String[] args, String method) {
		PermissionUser user = PermissionsEx.getUser(args[1]);
		if (user == null) {
			sender.sendMessage("PermissionUser null");
			return false;
		}
		try {
			if (method.equalsIgnoreCase("promote")) {
				user.promote(null, null);
			} else if (method.equalsIgnoreCase("demote") ) {
				user.demote(null, null);
			}
		} catch (RankingException e) {
			e.printStackTrace();
			plugin.getLogger().severe("RankingException Occured. Check Console.");
			return false;
		}
		return true;
	}

	private boolean execute1(CommandSender sender, Command command, String label, String[] args) {
		String playerName = CommandUtils.getMatchedPlayerName(args[0]);
		sender.sendMessage("getMatchedPlayerName: " + playerName);
		if (playerName == null) {
			playerName = args[0];
			sender.sendMessage("getMatchedPlayerName is null. set playerName: " + playerName);
		}
		McMMOPlayer mcPlayer = UserManager.getOfflinePlayer(playerName);
		if (mcPlayer == null) {
			sender.sendMessage("McMMOPlayer null");
		} else {
			sender.sendMessage("PowerLevel: " + Integer.toString(mcPlayer.getPowerLevel()));

			Player target = mcPlayer.getPlayer();
			CommandUtils.printGatheringSkills(target, sender);
			CommandUtils.printCombatSkills(target, sender);
			CommandUtils.printMiscSkills(target, sender);
		}
		return true;
	}


	private boolean execute2(CommandSender sender, Command command, String label, String[] args) {
		Player player = Bukkit.getOfflinePlayer(args[0]).getPlayer();
		if (player == null) {
			sender.sendMessage("Player null");
		} else {
			if (player.hasPlayedBefore()) {
			    UUID uuid = player.getUniqueId();
			    sender.sendMessage("UUID: " + uuid.toString());
			}
			int toReturn = 0;
			for (SkillType skill : SkillType.values()) {
				toReturn += ExperienceAPI.getLevel(player, skill.name());
			}
			sender.sendMessage("TotalLevel: " + toReturn);
		}

		return true;
	}

	private boolean execute3(CommandSender sender, Command command, String label, String[] args) {

		final List<PlayerStat> userStats = mcMMO.getDatabaseManager().readLeaderboard(null, 1, 10);
		for (PlayerStat stat : userStats) {
			sender.sendMessage(String.format("%s - %s", stat.name, stat.statVal));
		}
		return false;
	}

}
