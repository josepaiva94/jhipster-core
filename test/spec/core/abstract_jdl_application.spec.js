/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const AbstractJDLApplication = require('../../../lib/core/abstract_jdl_application');
const { MONGODB, COUCHBASE, CASSANDRA, NO } = require('../../../lib/core/jhipster/database_types');

describe('AbstractJDLApplication', () => {
  describe('::new', () => {
    let jdlApplicationConfig;

    context('without specifying special options', () => {
      before(() => {
        const jdlApplication = new AbstractJDLApplication({ config: { jhipsterVersion: '4.9.0' } });
        jdlApplicationConfig = jdlApplication.config;
      });

      it('uses default values', () => {
        expect(jdlApplicationConfig.languages.has('en') && jdlApplicationConfig.languages.has('fr')).to.be.true;
        expect(jdlApplicationConfig.testFrameworks).not.to.be.undefined;
        delete jdlApplicationConfig.languages;
        delete jdlApplicationConfig.testFrameworks;

        expect(jdlApplicationConfig).to.deep.equal({
          baseName: 'jhipster',
          buildTool: 'maven',
          clientPackageManager: 'npm',
          databaseType: 'sql',
          devDatabaseType: 'h2Disk',
          enableHibernateCache: true,
          enableSwaggerCodegen: false,
          enableTranslation: true,
          jhiPrefix: 'jhi',
          jhipsterVersion: '4.9.0',
          messageBroker: false,
          nativeLanguage: 'en',
          packageFolder: 'com/mycompany/myapp',
          packageName: 'com.mycompany.myapp',
          prodDatabaseType: 'mysql',
          searchEngine: false,
          serviceDiscoveryType: false,
          skipClient: false,
          skipServer: false,
          skipUserManagement: false,
          websocket: false
        });
      });
    });
    context("when having as client framework 'angular'", () => {
      before(() => {
        const jdlApplication = new AbstractJDLApplication({
          config: { clientFramework: 'angular', jhipsterVersion: '4.9.0' }
        });
        jdlApplicationConfig = jdlApplication.config;
      });

      it("replaces it by 'angularX'", () => {
        expect(jdlApplicationConfig.clientFramework).to.equal('angularX');
      });
    });
    context('when having booleans for entity and dto suffix options', () => {
      before(() => {
        const jdlApplication = new AbstractJDLApplication({
          config: { dtoSuffix: false, entitySuffix: false }
        });
        jdlApplicationConfig = jdlApplication.config;
      });

      it('casts them as empty strings', () => {
        expect(jdlApplicationConfig.dtoSuffix).to.equal('');
        expect(jdlApplicationConfig.entitySuffix).to.equal('');
      });
    });
    [MONGODB, COUCHBASE, CASSANDRA, NO].forEach(databaseType => {
      context(`when the DB type is either ${databaseType}`, () => {
        before(() => {
          const jdlApplication = new AbstractJDLApplication({
            config: { databaseType }
          });
          jdlApplicationConfig = jdlApplication.config;
        });

        it('sets devDatabaseType to its value', () => {
          expect(jdlApplicationConfig.devDatabaseType).to.equal(databaseType);
        });
        it('sets prodDatabaseType to its value', () => {
          expect(jdlApplicationConfig.prodDatabaseType).to.equal(databaseType);
        });
      });
    });
    context('when the application is reactive', () => {
      let application;

      before(() => {
        application = new AbstractJDLApplication({
          config: {
            reactive: true
          }
        });
      });

      it('should unset any cache provider', () => {
        expect(application.config.cacheProvider).to.equal('no');
      });
    });
  });
  describe('#getEntityNames', () => {
    context('when there is no entity', () => {
      let result;

      before(() => {
        const jdlApplication = new AbstractJDLApplication({ config: { jhipsterVersion: '4.9.0' } });
        result = jdlApplication.getEntityNames();
      });

      it('returns an empty list', () => {
        expect(result.size).to.equal(0);
      });
    });
    context('when there are entities', () => {
      let result;

      before(() => {
        const jdlApplication = new AbstractJDLApplication({
          config: { jhipsterVersion: '4.9.0' },
          entities: ['A', 'B']
        });
        result = jdlApplication.getEntityNames();
      });

      it('returns the entity list', () => {
        expect(result).to.deep.equal(new Set(['A', 'B']));
      });
    });
  });
  describe('#forEachEntityName', () => {
    let application;

    before(() => {
      application = new AbstractJDLApplication({ entities: ['A', 'B'] });
    });

    context('when not passing a function', () => {
      it('does not fail', () => {
        application.forEachEntityName();
      });
    });
    context('when passing a function', () => {
      const result = [];

      before(() => {
        application.forEachEntityName(entityName => {
          result.push(entityName);
        });
      });

      it('uses each entity name', () => {
        expect(result).to.deep.equal(['A', 'B']);
      });
    });
  });
  describe('#toString', () => {
    context('when there is no entity', () => {
      let jdlApplication;

      before(() => {
        jdlApplication = new AbstractJDLApplication({ config: { jhipsterVersion: '4.9.0' } });
      });

      it('stringifies the application object', () => {
        expect(jdlApplication.toString()).to.eq(`application {
  config {
    databaseType sql
    devDatabaseType h2Disk
    enableHibernateCache true
    enableSwaggerCodegen false
    enableTranslation true
    jhiPrefix jhi
    languages [en, fr]
    messageBroker false
    nativeLanguage en
    packageName com.mycompany.myapp
    prodDatabaseType mysql
    searchEngine false
    serviceDiscoveryType false
    skipClient false
    skipServer false
    testFrameworks []
    websocket false
    jhipsterVersion "4.9.0"
    baseName jhipster
    buildTool maven
    skipUserManagement false
    clientPackageManager npm
  }
}`);
      });
    });
    context('when there are listed entities', () => {
      let jdlApplication;

      before(() => {
        jdlApplication = new AbstractJDLApplication({ entities: ['A', 'B', 'C', 'C'] });
      });

      it('exports the entity names', () => {
        expect(jdlApplication.toString()).to.equal(
          `application {
  config {
    databaseType sql
    devDatabaseType h2Disk
    enableHibernateCache true
    enableSwaggerCodegen false
    enableTranslation true
    jhiPrefix jhi
    languages [en, fr]
    messageBroker false
    nativeLanguage en
    packageName com.mycompany.myapp
    prodDatabaseType mysql
    searchEngine false
    serviceDiscoveryType false
    skipClient false
    skipServer false
    testFrameworks []
    websocket false
    baseName jhipster
    buildTool maven
    skipUserManagement false
    clientPackageManager npm
  }

  entities A, B, C
}`
        );
      });
    });
    context('when the jhipsterVersion option is there', () => {
      context('when it is not quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { jhipsterVersion: '6.5.1' } });
          result = application.toString();
        });

        it('should stringify it quoted', () => {
          expect(result).to.include('jhipsterVersion "6.5.1"');
        });
      });
      context('when it is quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { jhipsterVersion: '"6.5.1"' } });
          result = application.toString();
        });

        it('should not stringify it again', () => {
          expect(result).to.include('jhipsterVersion "6.5.1"');
        });
      });
    });
    context('when the jwtSecretKey option is there', () => {
      context('when it is not quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { jwtSecretKey: 'ASTUPIDLYLONGWORD=' } });
          result = application.toString();
        });

        it('should stringify it quoted', () => {
          expect(result).to.include('jwtSecretKey "ASTUPIDLYLONGWORD="');
        });
      });
      context('when it is quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { jwtSecretKey: '"ASTUPIDLYLONGWORD="' } });
          result = application.toString();
        });

        it('should not stringify it again', () => {
          expect(result).to.include('jwtSecretKey "ASTUPIDLYLONGWORD="');
        });
      });
    });
    context('when the rememberMeKey option is there', () => {
      context('when it is not quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { rememberMeKey: 'ASTUPIDLYLONGWORD=' } });
          result = application.toString();
        });

        it('should stringify it quoted', () => {
          expect(result).to.include('rememberMeKey "ASTUPIDLYLONGWORD="');
        });
      });
      context('when it is quoted', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { rememberMeKey: '"ASTUPIDLYLONGWORD="' } });
          result = application.toString();
        });

        it('should not stringify it again', () => {
          expect(result).to.include('rememberMeKey "ASTUPIDLYLONGWORD="');
        });
      });
    });
    context('when the entitySuffix is present', () => {
      context('without a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { entitySuffix: '' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).not.to.include('entitySuffix');
        });
      });
      context('with a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { entitySuffix: 'Entity' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).to.include('entitySuffix Entity');
        });
      });
    });
    context('when the dtoSuffix is present', () => {
      context('without a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { dtoSuffix: '' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).not.to.include('dtoSuffix');
        });
      });
      context('with a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { dtoSuffix: 'DTO' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).to.include('dtoSuffix DTO');
        });
      });
    });
    context('when the clientThemeVariant is present', () => {
      context('without a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { clientThemeVariant: '' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).not.to.include('clientThemeVariant');
        });
      });
      context('with a value', () => {
        let result;

        before(() => {
          const application = new AbstractJDLApplication({ config: { clientThemeVariant: 'aVariant' } });
          result = application.toString();
        });

        it('should not stringify it', () => {
          expect(result).to.include('clientThemeVariant aVariant');
        });
      });
    });
    context('when the blueprints option is present', () => {
      let result;

      before(() => {
        const application = new AbstractJDLApplication({ config: { blueprints: ['whatever'] } });
        result = application.toString();
      });

      it('should not stringify it', () => {
        expect(result).not.to.include('blueprints');
      });
    });
    context('when the packageFolder option is present', () => {
      let result;

      before(() => {
        const application = new AbstractJDLApplication({ config: { packageFolder: 'whatever' } });
        result = application.toString();
      });

      it('should not stringify it', () => {
        expect(result).not.to.include('packageFolder');
      });
    });
  });
});
