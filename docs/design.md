## Design overview

Sock calculator is designed to calculate stitch count for knitting socks based on given parameters. The intention is for the user to enter in foot mesurements and yarn tension and the application will calcuate the required stitch count. There will be options for each part of the sock, (such as the cuff, leg, heel, and toe) that each drive the calculation for that section. eg Gussetted heel will need different stitch counts compared to a short-row heel.

While a lot of customisation can be done, the key goal is to be simple and intuitive to use, and should allow the user to quickly perform calculations with minimal data entry. This will be accomplished though a combination of sensible default and calculated values. The minimal experierence would be the user entering foot length and circumference.

## Features

### Data Persistance
Data will be persisted in the local browser using an industry recommended storage mechanism. There will not be a backend api or user logins and data will be local to the device.
To facilitate a mechanism for sharing/restoring data, there will be an option to export the whole record or key entitites as JSON files, and an option to import them back into the application.

### Yarn profiles
A yarn type can be recorded with it's manufacture and material.

### Yarn tension
For a given type of yarn, a tension can be recorded with yarn weight, needle size, stitch/pattern type, and whether it was swatched circular or flat. This will also include a small calculator to assist the user in determining the tension based on their swatch. The basic form will just have width/height for stich and row count, but will include an "advanced" mode where the size of a repeating pattern can be specified to simplify meansurements. eg. for basic 4x8 seersucker user could enter number of diamonds, and it'll multiply that my the pattern size.

### Foot measurements 
(Might want better name?)

Measurements of a persons foot, used as driving parameters for calculations. They require foot length and circumference at a minimum, but additional values can be specified to improve accuracy. When entering measurements, calculated values for the optional fields will be displayed to assist the user. Eg. calf and ankle circumferences can be previewed based on entered foot circumference. The UI for this should include an intuitive form and illustration showing the locations of each measurement.

- Foot length
- Foot circumference
- Ankle diagonal (optional)
- Ankle circumference (optional)
- Heel height (optional)
- Instep circumference/Gusset circumference (optional)
- Toe length (optional)
- Low calf circumference (optional)
- High calf circumference (optional)

### Sock pattern
Represents common information for this type of sock that you'd want to share between different pairs. eg. link to pattern source, notes, recommended weight, pattern gauge. I suppose it could also include the default heel/toe/ribbing styles and yarn from the pattern to use as defaults, but are not mandatory.

### Knitting Project
(Will want a better name)
Represents an individual knitting project for a pair of socks. This will include references to the sock pattern being used, the yarn profile, and the foot measurements. It will also allow the user to override default values from the sock pattern, such as heel/toe/ribbing styles, or measurements for a person (eg. you might want a different leg length, so you'll need to adjust that and the calf size).


## Future Enhancements

- Support for increasing/decreasing diameter along foot or leg. Gussetted heels are kind of an edge case, but are deterministic in standard design, and the reduction is just from the heel flap.
- Generate the knitting pattern itself for the user based on the calculated stitch count.
- User defined calculated fields. For example define that a calf circumference is 1.3x the foot circumference.