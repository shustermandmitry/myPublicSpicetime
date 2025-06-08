# Ingredient Inheritance Tree

*Visual guide showing which ingredients enable which recipes*

## Tree Structure

```
Universal Base (Core Ingredients)
├── All-purpose flour
├── Salt  
├── Vegetable oil
├── Soy sauce
├── Sesame oil
├── White pepper
├── Cornstarch
├── Sugar
└── Fresh ginger
    │
    ├─── WRAPPER BRANCH
    │    ├── Basic Dumpling Wrapper
    │    │   ├── + Boiling water
    │    │   └── ENABLES: Siu Mai, Xiao Long Bao, Pot Stickers
    │    │
    │    ├── Har Gow Wrapper  
    │    │   ├── + Wheat starch (澄粉)
    │    │   ├── + Tapioca starch
    │    │   └── ENABLES: Har Gow (Crystal Shrimp Dumplings)
    │    │
    │    └── Char Siu Bao Dough
    │        ├── Traditional Path
    │        │   ├── + Active dry yeast
    │        │   └── ENABLES: Steamed/Baked BBQ Pork Buns
    │        └── Sourdough Path
    │            ├── + Active sourdough starter
    │            └── ENABLES: Tangy Steamed/Baked Buns
    │
    └─── PROTEIN BRANCH
         ├── Ground Pork
         │   ├── ENABLES: Siu Mai, Xiao Long Bao
         │   └── + Stock/Gelatin → Xiao Long Bao (soup)
         │
         └── Raw Shrimp
             ├── ENABLES: Har Gow, Siu Mai
             ├── + Bamboo shoots → Har Gow
             └── + Shiitake mushrooms → Siu Mai

SPECIALTY ADDITIONS
├── Bamboo shoots → Har Gow texture
├── Shiitake mushrooms → Siu Mai umami  
├── Wheat starch → Har Gow translucency
├── Stock + Gelatin → Xiao Long Bao soup
└── Green onions → Universal garnish/flavor
```

## Recipe Enablement Map

### If You Have Universal Base + Basic Wrapper:
- ✅ **Siu Mai** (+ ground pork + shrimp + shiitake)
- ✅ **Xiao Long Bao** (+ ground pork + stock + gelatin)

### If You Have Universal Base + Har Gow Wrapper:
- ✅ **Har Gow** (+ shrimp + bamboo shoots)

### If You Have Universal Base + Char Siu Bao Dough:
- ✅ **Char Siu Bao** (+ BBQ pork filling - recipe coming)

### Specialty Item Impact:
- **Wheat Starch** → Unlocks all translucent wrapper recipes
- **Shiitake Mushrooms** → Enhances umami in pork-based recipes  
- **Bamboo Shoots** → Essential for har gow texture
- **Stock + Gelatin** → Required for soup dumplings

## Shopping Strategy

### Phase 1 - Universal Base (Enables Everything)
Buy these first - they're used across all recipes:
- Flour, salt, oil, soy sauce, sesame oil, white pepper, cornstarch, sugar, ginger

### Phase 2 - Choose Your Path
**Dumpling Path**: Basic wrapper ingredients → Siu Mai + Xiao Long Bao
**Crystal Path**: Wheat starch + tapioca → Har Gow  
**Bun Path**: Yeast or starter → Char Siu Bao

### Phase 3 - Proteins & Specialties
- Ground pork (most versatile)
- Shrimp (har gow + siu mai)
- Specialty items based on chosen recipes

## Cost Optimization

**High Impact, Low Cost**: Universal base ingredients
**Medium Impact, Medium Cost**: Basic proteins (pork, shrimp)
**Low Impact, High Cost**: Specialty items (wheat starch, bamboo shoots)

**Strategy**: Start with universal base, add one specialty branch at a time.
