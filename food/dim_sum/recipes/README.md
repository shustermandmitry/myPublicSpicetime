# Dim Sum Recipe Collection

*Three tree system for party planning (serves 5 people)*

## Three Tree System

### [wraps.recipes](wraps.recipes/) 🥟
Choose your wraps:
- Basic dumpling (most versatile)
- Har gow (translucent)
- Char siu bao dough (for buns)

### [fillings.recipes](fillings.recipes/) 🥩
Choose your fillings:
- Pork (siu mai, xiao long bao)
- Shrimp (har gow)
- Mixed (char siu)

### [dim_sum.recipes](dim_sum.recipes/) 🍽️
Complete recipes combining trees:
- Har Gow (har gow wrap + shrimp filling)
- Siu Mai (basic wrap + pork filling)
- Xiao Long Bao (basic wrap + pork filling)
- Char Siu Bao (bao dough + char siu filling)

## File Structure
Each node has:
- **recipe.md** - Instructions for this level
- **ingredients.list** - What you need
- **votes.list** - Vote to make this
- **commitments.list** - Claim ingredients
- **expenses.ledger** - Track costs

## How to Plan (5 People)
1. **Vote in all trees** - pick what you want to make
2. **Vote regardless of volume** - we'll adjust total to meet participation
3. **Claim ingredients** - use [../commitments.list.md](../commitments.list.md)
4. **Track costs** - use [../expenses.ledger.md](../expenses.ledger.md)
5. **Party time** - make your voted recipes!

## Voting Strategy
- **Vote for what interests you** - don't worry about total volume
- **We'll adjust quantities** based on final participation count
- **Each recipe serves 5** - we'll scale up/down as needed
- **Mix and match possible** - any wrap + any filling works

## Quick Start for Party Planning

1. **[Read the guide](../HOW-TO-USE.md)** - 5-minute setup
2. **Browse recipes below** and vote in `votes.md` files
3. **Claim ingredients** in `commitments.md` files
4. **Track expenses** in `expenses.md` files (including personal stock)
5. **Party time!** 🥟

### Personal Stock & Compensation
- **List estimates** for items from your personal stock in `expenses.md`
- **We'll compensate** all costs - don't worry about bringing your own stuff
- **Leftovers shared** in doggy bags - whatever's not eaten gets divided up
- **Fair splitting** - all expenses divided evenly among attendees

### Ingredient Inheritance Tree

**Visual Guide**: See [INGREDIENT-TREE.md](INGREDIENT-TREE.md) for complete inheritance map

**Organized Structure**: Browse [inheritance-tree/](inheritance-tree/) folder for hierarchical organization:
- **[universal-base/](inheritance-tree/universal-base/)** - Foundation ingredients enabling all recipes
- **[wrapper-branch/](inheritance-tree/wrapper-branch/)** - All wrapper types with dependencies
- **[protein-branch/](inheritance-tree/protein-branch/)** - Protein fillings with specializations
- **[complete-recipes/](inheritance-tree/complete-recipes/)** - Full recipes showing inheritance chains

## Recipe Categories

### Wrappers & Doughs (Foundation)
- [Basic Dumpling Wrapper](basic-dumpling-wrapper/) - Foundation for most dumplings
- [Har Gow Wrapper](har-gow-wrapper/) - Translucent wrapper for crystal dumplings
- [Char Siu Bao Dough (Traditional)](char-siu-bao-dough-traditional/) - Yeasted dough for buns
- [Char Siu Bao Dough (Sourdough)](char-siu-bao-dough-sourdough/) - Tangy sourdough version

### Steamed Dumplings
- [Har Gow](har-gow/) - Crystal shrimp dumplings
- [Siu Mai](siu-mai/) - Open-topped pork & shrimp dumplings
- [Xiao Long Bao](xiao-long-bao/) - Soup dumplings

### Pan-Fried Items
- Pot Stickers (Guo Tie) - *Coming soon*

### Baked Items
- Char Siu Bao (BBQ Pork Buns) - *Coming soon*
- Egg Custard Tarts (Dan Tat) - *Coming soon*

### Rice & Grain Items
- Lo Mai Gai (Sticky Rice in Lotus Leaf) - *Coming soon*
- Cheung Fun (Rice Noodle Rolls) - *Coming soon*

### Sweet Dim Sum
- Mango Pudding - *Coming soon*
- Sesame Balls (Jin Deui) - *Coming soon*

## Getting Started

1. **Start with wrappers** - Master the basic dumpling wrapper first
2. **Build up complexity** - Begin with siu mai before attempting har gow or xiao long bao
3. **Check ingredient inheritance** - Each recipe shows what it inherits from base categories
4. **Plan your shopping** - Use the context/dim_sum_ingredients_hierarchy.md for efficient shopping

## Reference Files
- [Complete Recipe List](../context/dim_sum_recipes.md) - Original comprehensive recipes
- [Ingredients Hierarchy](../context/dim_sum_ingredients_hierarchy.md) - Shopping guide with inheritance patterns
