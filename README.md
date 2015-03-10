# els-combo
Combo simulator for the fighting game Elsword Online. Combos are created by chaining together the built-in three to four hit sequences with a variety of special attacks to constantly flinch opponents without letting them hit the floor.

Normal attacks are performed with Z, X, and the arrow keys. They do not cost mana but are relatively weak and increment the opponent's knock down gauge by a certain value. Special attacks (actives and special actives) are performed by pressing a skill key. They generally have 0 KD and can be used to cancel combos before the final knockdown hit, making them extremely useful for extending the length of combos. However, special attacks cost mana and some of them also knock down the opponent, meaning those skills should only be used as combo finishers.

A link to an old video I made explaining the basics of comboing in Elsword. [Part 2](https://www.youtube.com/watch?v=N5WZbiKeb5I&feature=youtu.be&t=1m52s) is especially relevant, as it illustrates this app's purpose perfectly.

Basic Usage:
- Click any action to append it to the combo chain
- Click the large portrait on the left to remove the previous action
- The info box reflects the statistics of your current total combo

Limitations:
- When the KD counter reaches 100, the next hit will automatically knock down
- MP usage cannot drop below -300
- Skills cannot be used while they are still cooling down

Planned updates:
- Exporting/saving feature to share combos
- Resume where you left off using cookies
- Instructions/FAQ on the website itself
- Display information when mousing over a certain attack
- Blade Master is only 1 of the 18 classes in the game. Add support for the other 17
- More interesting UI
