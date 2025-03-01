# v6.0.5

## Bug fixes:
  - When having a relationship like this:
    ```
    relationship OneToOne {
      A to B with jpaDerivedIdentifier,
      C to D
    }
    ```
    
    The parsing system didn't know if the comma was separating the relationship from A to B or the relationship option
    list.

    The comma is supposed to separate both, but a restriction has been made in this case: a comma without
    a new line has to separate relationship options.
    - Issue: [From the generator: #10824](https://github.com/jhipster/generator-jhipster/issues/10824)

---

# v6.0.4

## Bug fixes:
  - Authorized some relationships from & to the User entity:
    - This is in the "bug fix" section as the JDL was way too permissive and let some invalid relationships pass.
    - For Many-to-One cases:
      - if the User entity has the injected field without the skipUserMgt option set, it should fail
    - For Many-to-Many cases:
      - if there is an unidirectional relationship to the User, it should not fail as this is a valid case

---

# v6.0.3

## What's new:
  - Improved error message when having a unidirectional Many-to-Many relationship
    - Now tells the injected fields in the source & destination entities for better pinpointing.
  - Added the ValidatedJDLObject, which performs validations to entities, relationships, etc.
    - The regular JDLObject doesn't do them anymore.
  - Also added the ValidatedJDLOptions class
    - It has the same behavior as the ValidatedJDLOptions.

---

# v6.0.2

## Bug fixes:
  - JDL export:
    - Exporting to JDL no longer validates the JDL
    - However, reimporting it can causes failures if the exported JDL has no longer supported values.
  - Fixed JPADerivedIdentifier option:
    - The issue was that the exported JSON files for both entities of a relationship had the option
    - The correct way was just to have the option in the owner side of the relationship

---

# v6.0.1

## Bug fixes:
  - During the JDL export, if the `rememberMeKey` option exists in the .yo-rc.json file, then the export failed.
    - The fix consists in ignoring it, just like the `jwtSecretKey` app option.

---

# v6.0.0

## Breaking changes
  - **JDLImporter**:
    - Previously, it was a class that could be instantiated from either JDL files or string, and a configuration object.
    - Now, in order to create a JDL importer, one must use createImporterFromContent or createImporterFromFiles.
  - **JDLLinter**:
    - Previously, it was a class that could be instantiated from JDL files.
    - Now, in order to create a JDL linter, one must use createLinterFromContent or createLinterFromFiles.
      - This adds the possibility to lint inline JDL
  - **JDL(entity, field, enum, etc.)**:
    - Removed validity check methods and moved them to the BusinessErrorChecker or their own validators.
  - **BinaryOptions**:
    - Removed the `pager` value from the `pagination` option.
      - That was already removed from the generator when moving from bootstrap v3 to v4.

## What's new
  - Introduced new API, which will be the future API (for v7)
    - Used by doing `require('jhipster-core').PACKAGE`
    - The packages are as follows:
      - **jdl**: concerns the JDL (conversion, export, import, objects, linting, etc.)
      - **jhipster**: concerns JHipster as a whole (reserved keywords, application types, etc.)
      - **json**: concerns JSON-file handling (export)
        - Will be deprecated and remove if and when JHipster goes full JDL-centric
  - Passing a path to the `clientRootFolder` is now possible
  - Custom enum values are now possible:
  ```
  enum Language {
    FRENCH (frenchy),
    ICELANDIC (viking)
  }
  ```

## Fixed
  - Having a field's name starting with `all...` (like `allowMultiple`) works again
    - This was fixed by removing the `all` keyword from the parsing system and relying on the existing matchers to
      notice if the JDL file contains the "all" keyword
    - Related issue: [#389](https://github.com/jhipster/jhipster-core/issues/389)
  - Added missing many-to-many side when needed
    - Related issue: [#352](https://github.com/jhipster/jhipster-core/issues/352)
    - This snippet didn't work before as it broke the fluent methods:
    ```
    relationship ManyToMany {
        A{b) to B
    }
    ```
  - Fixed parsing the jpaDerivedIdentifier option
    - Related issue [#388](https://github.com/jhipster/jhipster-core/issues/388)

---

# v5.0.0

## Breaking changes
  - [BinaryOptions] Replaced `SEARCH_ENGINE` with `SEARCH`
  - Changed the way commenting works:
    - Comments must appear before annotations, always

## What's new
  - Added `redis` and `caffeine` for `cacheProvider` (thanks to @Shaolans and @murdos)
  - Custom annotations have been implemented (thanks to @yelhouti)
    - For entities, relationships and fields
  - Added `jwtSecretKey` to the JDL
  - Added option `readonly` to declare an entity as read only (@murdos)
  - Exporting a JDL to a specific file is now possible
  - Parsing a JDL as a string is possible (thanks to @deepu105)

## Fixed
  - Fixed detection of changed entities when custom attribute in json file (thanks to @murdos)

---

# v4.3.0

## What's new
  -  Unset `cacheProvider` option when the application type is `reactive`
  -  Made the `reactive` option available

## Fixed
  - Fixed multi-line JDL comment generation (thanks to @yelhouti for the report!)
  - Fixed checkNoSQLModeling with multi applications (thanks to @clement26695!)

---

# v4.2.0

## What's new
  - Improved and fixed the JDL export, which now exports single & multi apps with their entities (thanks to @Shaolans)


## Fixed
  - The entity's `changelogDate` is now preserved when re-generating the same entity, which doesn't result in an entity
    rewrite when reimporting (thanks to @kaidohallik)

---

# v4.1.1

## What's new
  - Added the JDL linter rules to the API

---

# v4.1.0

## What's new
  - Added the JDL linter available to the API

---

# v4.0.2
_note: v4.0.1 is the same_

## What's new
  - `vuejs` has been added as a valid client option

---

# v4.0.0

## Breaking changes
  - Removed methods `#addEntity` and `#excludeEntity` from JDLUnaryOption & JDLBinaryOption classes.
    - In favor of the `#addEntityName` and `#excludeEntityName` methods that take strings instead of entities.

## What's new
  - Having `no` as DB type is now allowed for any app (thanks to @jsm174 for notifying, and @ruddell & @cbornet for the help).
  - Additionally, having `no` as DB type automatically sets the `devDatabaseType` & `prodDatabaseType` values to `no` (thanks @jsm174 from reporting it).
  - Linting: added the 'collapsible relationships" check
  - For blueprints: when a JSON entity file has custom attributes, the JDL import subgen now just merges the old content with the new one
  - The `UUID` type is now available for all the DB types! (thanks to @murdos)

## Bug fixes
  - Parsing regexp with slashes involved now works again (https://github.com/jhipster/generator-jhipster/issues/9750)

---

# v3.6.14

## What's new
  - Added new option `memcached` to cache providers (thanks to @Hawkurane),
  - Added `RelationshipOptions` to the API,
  - Linting: added the 'unused enums' rule

## Bug fixes
  - Relationship options are now correctly exported (notably: the `jpaDerivedIdentifier` option)
  - Application base names can now have underscores (thanks to @Shaolans)

---

# v3.6.13

## What's new
  - This changelog file :)
  - Removed Rancher from the JDL
  - Removed `istioRoute`
  - `istio` is now a boolean
  - Improved error message for relationships between applications
  - `Duration` has been added as type (thanks to @massimosiani)

## Bug fixes
  - Nothing

---

# v3.6.12
_Released on: 2019-03-03_

## What's new
  - Made selecting DTOs without services not throw an error (thanks @ruddell)
  - Supported relations when an application uses Couchbase as DB (thanks @tchlyah)
  - Sonar reports are configured (thanks @jdubois)

## Bug fixes
  - An application's baseName can now have an underscore in the JDL (thanks @Shaolans)

As a side note, the linter has been added, but will only be available in v3.7.0.

---

# v3.6.11
_Released on: 2019-02-14_

## What's new
  - Nothing

## Bug fixes
  - Fixed invalid `otherEntityRelationshipName` generated for the destination entity of a relationship (thanks @pvliss)

---

# v3.6.10
_Released on: 2019-02-09_

## What's new
  - Merged the `lint` branch into `master`, but didn't make it available yet

## Bug fixes
  - Fixed regression with generation of `otherEntityRelationshipName` (thanks @pvliss)

---

# v3.6.9
_Released on: 2019-01-29_

## What's new
  - Nothing

## Bug fixes
  - Allowed relationships from the User entity if `skipUserManagement` is set (thanks @murdos)
  - Always set the `otherEntityRelationshipName` to the appropriate value (thanks @pvliss)

---

# v3.6.8
_Released on: 2019-01-25_

## What's new
  - Warned rather than throw an exception when a reserved word is used as field name (thanks @murdos)
  - Added the `jpaDerivedIdentifier` option to relationships

## Bug fixes
  - Fixed issue with `unique` validation for `LocalDate`

---

# v3.6.7
_Released on: 2018-11-12_

## What's new
  - Nothing

## Bug fixes
  - Fixed the exporting of a JDL Deployment (didn't display the `deployment` keyword before)

---

# v3.6.6
_Released on: 2018-11-11_

## What's new
  - Set defaults for `devDBType` and `prodDBType`

## Bug fixes
  - Fixed validation for `ingressdomain` (thanks @deepu105)

---

# v3.6.5
_Released on: 2018-11-11_

## What's new
  - `devDatabaseType` & `prodDatabaseType` can now be set to default values depending on the `databaseType` prop

## Bug fixes
  - The `serviceDiscoveryType` negative default value is now `false`

---

# v3.6.4
_Released on: 2018-11-11_

## What's new
  - Nothing

## Bug fixes
  - Prevent duplicate entities from being exported (thanks @deepu105)

---

# v3.6.3
_Released on: 2018-11-11_

## What's new
  - Nothing

## Bug fixes
  - Fixed exported deployments when importing a JDL file, now exports an empty list if there's no deployment to export (thanks @deepu105)

---

# v3.6.2
_Released on: 2018-11-11_

## What's new
  - Nothing

## Bug fixes
  - Fixed what the JDL importer returns when there is no deployment (now returns an empty list for deployments if there's nothing) (thanks @deepu105)

---

# v3.6.1
_Released on: 2018-11-06_

## What's new
  - More DB validations are included (combinations, forbidden values)
  - Specifying a blueprint is now possible

## Bug fixes
  - Issue [#8760](https://github.com/jhipster/generator-jhipster/issues/8760) from the generator should be fixed, thanks to @pascalgrimaud 

---

# v3.6.0
_Released on: 2018-11-06_

## What's new
  - The brand new `deployment` syntax has been added to the JDL by @deepu105!

## Bug fixes
  - Nothing

---

# v3.5.0
_Released on: 2018-11-03_

## What's new
  - Application options are now validated
  - Options `dtoSuffix` & `entitySuffix` have been added (thanks to @mselerin!)
  - Just using `angular` as clientFramework fallbacks to using `angularX` (thanks to @jdubois for reporting it!)

## Bug fixes
  - JDL exporting now doesn't fail when there is no relationship (thanks to @pascalgrimaud!)
  - `skipUserManagement` isn't forced in UAA & gateway apps anymore (thanks to @jsm174!)
  - Package names can now have underscores (thanks to @jsm174!)
  - Importing a JDL file where entities are generated in different apps will cause the process to fail.

---

# v3.4.0
_Released on: 2018-10-07_

## What's new
  - **This project now uses NPM and not yarn**
  - Added the `unique` constraint
  - Used terser as minificator & uglifier (previously uglifly-webpack-plugin)

## Bug fixes
  - Quotes are now escaped properly in regex validations
  - JWT and rememberMe keys are no longer set in the project (done in the generator)
  - If an app is already generated, it keeps its values and only replaces the changed values
  - 0 doesn't make the JDL constraint fail any longer
  - Various fixes for JDL app generation:
    - Made eureka the default choice for MS & GW apps 
    - Made eureka the default choice for uaa apps 
    - uaa apps now have false skipUserManagement
  - The project's installation on windows works now

---

# v3.3.3
_Released on: 2018-09-15_

## What's new
  - Added support for MongoDB relationships (thanks to @ivangsa)

## Bug fixes
  - Fixed language regex (thanks to @ttoommbb)

---

# v3.3.2
_Released on: 2018-09-15_

## What's new
  - Nothing
  
## Bug fixes
  - The `rememberMe` and JWT keys are updated to match the generator's: they're not set anymore, the generator does that for us

---

# v3.3.1
_Released on: 2018-09-02_

## What new:
  - NPM is now the new default  for `clientPackageManager` (previously, yarn)

## Bug fixes:
  - Fixed DTO & service configuration in the JDL (#251), thanks @ruddell for finding it and filling an issue!

---

# v3.3.0
_Released on: 2018-09-02_

## What's new
  - Added package-lock.json file

## Bug fixes
  - Nothing

---

# v3.2.0
_Released on: 2018-09-02_

## What's new
  - Clarified error messages
  - The JDLRelationship object now accepts strings for entity names (from & to)
  - Now sets a default clientRootFolder value when in a microservice app (#252)
  - (a basic) Prettier support has been added to the project

## Deprecated
  -  AbstractJDLOption methods
    - #addEntity & #ecludeEntity will be replaced by: #addEntityName & #excludeEntityName
  - The JDLRelationship will only accept string for entity names (from & to)

---

# v3.1.0
_Released on: 2018-07-17_

## What's new
  - The migration to [chevrotain](https://github.com/sap/chevrotain) is finally over! Which gets us more control over the parsing system (and more tests, coverage, speed when developing features)
  - Annotations for options are implemented:
```
@dto(mapstruct)
@service(serviceClass)
entity A
```
  - The `jhipsterVersion` property for applications is deprecated and will be removed in the next major release
  - When exporting entities to JDL, the table name is now only exported as long as it's not the same as the entity name
  - 242, required relationships from/to the same entity are forbidden
  - 243, constrained the use of `no` as database type (from the generator)
  - 244, `TextBlob` only have `required` as constraint (from the generator)
  - API:
    - The JDLObject now has loop methods over entities, applications etc. 

**Huge thanks to @bd82 for his tremendous help proposing the migration and getting it done!**

## Bug fixes
  - 239, Fixed error message and type check per application
  - When declaring arrays in the JDL (for languages, testFrameworks, etc.), braces didn't really work, this is fixed, the two possible syntaxes are `languages []` or `languages [fr, en]`. **braces are mandatory**
  - Creating directories failed on windows
  - Added the entities for each exported JDL application
  - @ruddell fixed the relationships when not selecting injected fields

---

# v3.0.2
_Released on: 2018-06-13_

## What's new
  - Injected fields are now optional, so having this: `relationship XYZ { A to B }` is possible from now on.
  - App options in the JDL `testFrameworks`, `langauges` don't require braces around anymore (optional)

## Bug fixes
  - `oauth2` is now available as an `authenticationType` option for the app generation

---

# v3.0.1
_Released on: 2018-06-11_

## What's new
  - Nothing

## Bug fixes
  - `searchEngine` is now set to `false` when excluding from the JDL (thanks to @Tcharl for this!)

---

# v3.0.0
_Released on: 2018-05-31_

## Breaking changes
  - `JDLObject#hasOption` has been removed (not used in the project)
  - `JDLReader::parse` has been removed (in favor of `::parseFromConfigurationObject`
  - The entity and application exporters now return relevant information:
    - Application exporter: the exported application list
    - Entity exporter: the exported entity list
  - Set is no longer exposed (future removal will happen, maybe)

## What's new
  - The class JDLImporter has been developed so as not to use the other ones (DocumentParser, JHipsterEntityExporter, etc.) directly. It has been created to be used in the import-jdl subgen, without having to use other classes.
  - MySQL 8 reserved keywords are in
  - The business checks are now done in a special class (BusinessErrorChecker) instead of doing them just after the JDL is parsed

## Bug fixes
  - Fixed #60
  - Application generation has been fixed
  - Fixed the `skipUserManagement` option
  - The `databaseType` is no longer needed in the DocumentParser (caused an issue when parsing applications)
  - Having DTOs without services is now forbidden
  - Using `no` as database type now works
  - Different jpaMetamodelFiltering values are now detected when checking for entity equality

As a side note, there are no longer react reserved keywords.
