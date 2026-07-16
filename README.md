# EdOS

EdOS is a React Native app for life management. I built it as a personalised, 'gamified' management tool to suit my own needs.

## Philosophy

EdOS rewards overcoming friction and resistance. The higher barrier to entry something is, the higher the XP gain. It is designed to avoid punishing missed goals, but instead to reward fulfilling commitments and persistence.

Trajectories or your goals have a temperature depending on how long ago you last logged them. No "you haven't done this this week!", just a hot, warm, cold, or frozen value as a nudge.

Making commitments gives you a bonus, but missing a commitment doesn't punish you.

## Components - XP System, Trajectories, Milestones, Loot, and More

EdOS is broken down into several interlinked parts, as outlined below.

### XP System

You gain experience and levels for logging tasks. For every XP you gain, you also gain one HP (Hero Point). Hero Points are used to purchase loot. XP also goes towards individual trajectories and attributes associated with those trajectories.

### Trajectories

Trajectories are a hobby, a project, an abstract thing to work on, whether it be something with a definitive end (like making an app), or something you can work on forever (like playing guitar). Trajectories have their own XP and level, a friction rating and attributes associated with them. The friction level is designed to reward higher effort trajectories - if you can sit at your desk and do something, it's low friction. If you have to go out and spend 20 minutes walking to do something, it's higher friction.

Trajectories also have a target for how many times per week you can reasonably work on the trajectory.

### Milestones

Milestones belong to Trajectories. They are a specific 'milestone' that you wish to achieve within the Trajectory. Once you complete a milestone, you attach a log to it and gain bonus XP for completion. Milestones can be attached to loot as an unlock requirement.

### Loot

Loot is rewards that are purchased with Hero Points. They may be locked behind a trajectory or multiple trajectories. It is recommended to price loot with 1 Hero Point = 1 unit of currency e.g. £0.01. Loot can be recurring or singular.

### Vault

The Vault is for ideas and things you want to look at later. If it isn't a milestone that is achievable immediately or something you want to think about doing at some undisclosed future point, pop it in the vault to get it out your brain.

### Notes

Notes are notes. You write notes. They are a todo list analogue. Randomly think of something? Note. Need to remember something? Note.



React Native app for goals, keeping track of what to do, rewards, etc.

Very WIP.

Run with:

```bash
npx expo start --tunnel
```
