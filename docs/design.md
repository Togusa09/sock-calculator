## Design overview

Sock calculator is designed to calculate stitch count for knitting socks based on given parameters. The intention is for the user to enter foot measurements and yarn tension and the application will calculate the required stitch count. There will be options for each part of the sock, such as the cuff, leg, heel, and toe, that drive the calculation for that section. For example, a gussetted heel will need different stitch counts compared to a short-row heel.

While a lot of customisation can be done, the key goal is to be simple and intuitive to use, and should allow the user to quickly perform calculations with minimal data entry. This will be accomplished through a combination of sensible default and calculated values. The minimal experience would be the user entering foot length and circumference.

All measurements and calculations will use metric units internally. Metric is the default display unit, with imperial units available as a display preference. Imperial values are converted to metric on input and are never used as the source of calculation. Needle sizes follow the same display rule, but use a lookup table rather than a mathematical conversion.

## Features

### Data Persistence
Data will be persisted in the local browser using an industry recommended storage mechanism. There will not be a backend api or user logins and data will be local to the device.
To facilitate a mechanism for sharing/restoring data, there will be an option to export the whole record or key entities as JSON files, and an option to import them back into the application. Imported data must be validated and include a schema version so future application versions can migrate it safely.

### Yarn profiles
A yarn type can be recorded with it's manufacture and material.

### Yarn tension
For a given yarn profile, one or more yarn tensions can be recorded. A yarn tension is a single gauge associated with that yarn, needle size, stitch/pattern type, and whether it was swatched circular or flat. Negative ease is stored on the yarn tension and may be overridden by an individual knitting project.

This will also include a small calculator to assist the user in determining tension from a swatch. Users may choose the measurement size, which defaults to 10 cm. A warning is displayed when the measurement size is below 10 cm because the result may be less accurate. The basic form will accept the measured width and height and the stitch and row counts. An advanced mode may specify the size of a repeating pattern and the number of repeats, such as the number of diamonds in a seersucker pattern.

### Foot measurements

Measurements of a person's foot, used as driving parameters for calculations. They require foot length and circumference around the ball of the foot at a minimum, but additional values can be specified to improve accuracy. Foot length is the full length from the back of the heel to the longest toe, including the toe section. Toe length is the length allocated to the knitted toe section and is therefore a separate value.

When entering measurements, calculated values for optional fields will be displayed to assist the user. For example, calf and ankle circumferences can be previewed based on entered foot circumference. User-entered values take precedence over calculated previews. The UI should include an intuitive form and illustration showing the locations of each measurement, including the heel diagonal shown in the design reference image.

- Foot length
- Foot circumference
- Heel diagonal (optional)
- Ankle circumference (optional)
- Heel height (optional)
- Instep circumference/gusset circumference (optional)
- Toe length (optional)
- Low calf circumference (optional)
- High calf circumference (optional)

### Sock pattern
Represents common information for this type of sock that you'd want to share between different pairs, such as a link to the pattern source, notes, recommended yarn weight, and pattern gauge. It may also include default heel, toe, and ribbing styles and yarn to use as defaults, but these are not mandatory.

### Knitting Project
(Will want a better name)
Represents an individual knitting project for a pair of socks. This will include references to the sock pattern being used, the yarn profile and yarn tension, and the foot measurements. It will allow the user to override defaults from the sock pattern, including heel, toe, ribbing, section lengths, and negative ease. Calculated values should be distinguishable from inherited defaults and project overrides, with an option to restore a default.

The initial MVP supports modular socks made from major sections connected by tubes:

- Ribbed or folded cuff
- Gussetted, afterthought, or short-row heel
- Round or star toe

The MVP treats the diameter as constant for the entire foot and leg. Changing the diameter between those areas would require increases or decreases and is a future enhancement, except where the standard gussetted heel construction changes the stitch count. The MVP calculates stitch counts at major points only and does not generate written instructions.

The supported ribbing choices are explicitly 1x1, 1x2, 2x2, and 3x3. Stitch counts initially round to the selected ribbing requirement. A user-defined ribbing or custom repeat is a future enhancement. Gussetted heels may have an adjustable heel flap size, while short-row and afterthought heels use fixed standard formulas initially.

When an optional measurement is unavailable, the relevant section uses its standard stitch-count formula rather than attempting to calculate a size-specific value. For example, a round toe decreases four stitches every second row, and a gussetted heel flap defaults to a number of rows equal to the stitches across the top of the foot. These formulas should be visible as defaults and replaceable by a project override when the MVP supports that control.

### Calculation model
The calculation is deliberately separated into two logical stages, similar to the distinction between a model and its generated toolpaths in 3D-printing software.

#### Foot size calculation
This stage models the wearer's foot and leg independently of any knitting construction. It converts entered measurements to metric units, applies any calculated defaults for omitted optional measurements, and produces the target circumferences and lengths for the foot and leg. The MVP produces one constant target circumference for the foot and leg, based on the mandatory ball-of-foot circumference unless a more specific project rule is introduced later.

#### Stitch calculation
This stage fits the selected sock construction to the foot-size model and yarn tension. It applies negative ease, converts the target circumference to stitches using the selected stitch gauge, and applies construction constraints and ribbing rounding. It then calculates the stitch counts at major points for the selected cuff, leg, heel, and toe options. Default section formulas may derive one value from another, such as using the top-of-foot stitch count to determine a gussetted heel flap row count.

The overall flow is:

1. Convert entered values to metric units.
2. Build the foot-size model from the measurements and standard defaults.
3. Apply the yarn tension's negative ease, or the project override, to the target circumference.
4. Convert the target circumference to stitches using the selected stitch gauge.
5. Apply the construction and ribbing constraints, including required rounding.
6. Calculate and display stitch counts at the major points for the selected cuff, leg, heel, and toe options.

Rows and section lengths are displayed as measurements in the MVP. Row counts and written knitting instructions are future enhancements.


## Future Enhancements

- Support for increasing/decreasing diameter along foot or leg. The initial MVP keeps the diameter constant within each section.
- Generate the knitting pattern itself for the user based on the calculated stitch count.
- User defined calculated fields. For example define that a calf circumference is 1.3x the foot circumference.
- More detailed heel and toe shaping controls, including configurable short-row shaping.
- Pattern-repeat-aware rounding and fit adjustments beyond the initial ribbing-based rounding.