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

/* eslint-disable no-new, no-unused-expressions */
const { expect } = require('chai');

const fs = require('fs');
const path = require('path');
const { convertEntitiesToJDL } = require('../../../lib/converters/json_to_jdl_entity_converter');
const UnaryOptions = require('../../../lib/core/jhipster/unary_options');
const { JPA_DERIVED_IDENTIFIER } = require('../../../lib/core/jhipster/relationship_options');
const {
  Options: { DTO, SEARCH, PAGINATION, MICROSERVICE, ANGULAR_SUFFIX, SERVICE },
  Values: {
    dto: { MAPSTRUCT },
    pagination,
    service: { SERVICE_CLASS },
    search: { ELASTIC_SEARCH }
  }
} = require('../../../lib/core/jhipster/binary_options');

describe('JSONToJDLEntityConverter', () => {
  describe('::convertEntitiesToJDL', () => {
    context('when not passing entities', () => {
      it('fails', () => {
        expect(() => convertEntitiesToJDL({})).to.throw('Entities have to be passed to be converted.');
      });
    });
    context('when passing entities', () => {
      let jdlObject;

      before(() => {
        const entities = new Map([
          ['Employee', readJsonEntity('Employee')],
          ['Country', readJsonEntity('Country')],
          ['Department', readJsonEntity('Department')],
          ['JobHistory', readJsonEntity('JobHistory')],
          ['Location', readJsonEntity('Location')],
          ['Region', readJsonEntity('Region')],
          ['Job', readJsonEntity('Job')],
          ['Task', readJsonEntity('Task')]
        ]);
        // const employeeRelationshipToDepartment = entities
        //   .get('Employee')
        //   .relationships.filter(r => r.relationshipName === 'department')[0];
        // employeeRelationshipToDepartment.javadoc = undefined
        // const employee = entities.get('Employee');
        // employee.relationships = employeeRelationships;
        // entities.set('Employee', employee);
        jdlObject = convertEntitiesToJDL({ entities });
      });

      context('when parsing a JSON entity to JDL', () => {
        it('parses entity javadoc', () => {
          expect(jdlObject.entities.Employee.comment).eq('The Employee entity.');
        });
        it('parses tableName', () => {
          expect(jdlObject.entities.Employee.tableName).eq('emp');
        });
        it('parses mandatory fields', () => {
          expect(jdlObject.entities.Country.fields.countryId.type).eq('Long');
          expect(jdlObject.entities.Country.fields.countryName.type).eq('String');
        });
        it('parses field javadoc', () => {
          expect(jdlObject.entities.Country.fields.countryId.comment).eq('The country Id');
          expect(jdlObject.entities.Country.fields.countryName.comment).to.be.undefined;
        });
        it('parses validations', () => {
          expect(jdlObject.entities.Department.fields.departmentName.validations.required.name).eq('required');
          expect(jdlObject.entities.Department.fields.departmentName.validations.required.value).to.be.undefined;
          expect(jdlObject.entities.Employee.fields.salary.validations.min.value).eq(10000);
          expect(jdlObject.entities.Employee.fields.salary.validations.max.value).eq(1000000);
          expect(jdlObject.entities.Employee.fields.employeeId.validations).to.be.empty;
        });
        it('parses enums', () => {
          const languageEnum = jdlObject.getEnum('Language');
          expect(languageEnum.name).eq('Language');
          expect(languageEnum.values.has('FRENCH')).to.be.true;
          expect(languageEnum.values.get('FRENCH').value).to.equal('french');
          expect(languageEnum.values.has('ENGLISH')).to.be.true;
          expect(languageEnum.values.has('SPANISH')).to.be.true;
        });
        it('parses options', () => {
          expect(
            jdlObject
              .getOptions()
              .filter(option => option.name === DTO && option.value === MAPSTRUCT && option.entityNames.has('Employee'))
              .length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(
                option =>
                  option.name === PAGINATION &&
                  option.value === pagination['INFINITE-SCROLL'] &&
                  option.entityNames.has('Employee')
              ).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(
                option =>
                  option.name === SERVICE && option.value === SERVICE_CLASS && option.entityNames.has('Employee')
              ).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(
                option =>
                  option.name === SEARCH && option.value === ELASTIC_SEARCH && option.entityNames.has('Employee')
              ).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(
                option =>
                  option.name === MICROSERVICE &&
                  option.value === 'mymicroservice' &&
                  option.entityNames.has('Employee')
              ).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(
                option =>
                  option.name === ANGULAR_SUFFIX && option.value === 'myentities' && option.entityNames.has('Employee')
              ).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(option => option.name === UnaryOptions.NO_FLUENT_METHOD && option.entityNames.has('Employee'))
              .length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(option => option.name === UnaryOptions.FILTER && option.entityNames.has('Employee')).length
          ).to.eq(1);
          expect(
            jdlObject
              .getOptions()
              .filter(option => option.name === UnaryOptions.READ_ONLY && option.entityNames.has('Employee')).length
          ).to.equal(1);
        });
      });

      context('when parsing JSON entities to JDL', () => {
        it('parses unidirectional OneToOne relationships', () => {
          expect(jdlObject.relationships.getOneToOne('OneToOne_Department{location}_Location')).not.to.be.undefined;
        });
        it('parses bidirectional OneToOne relationships', () => {
          expect(jdlObject.relationships.getOneToOne('OneToOne_Country{region}_Region{country}')).not.to.be.undefined;
        });
        it('parses bidirectional OneToMany relationships', () => {
          expect(jdlObject.relationships.getOneToMany('OneToMany_Department{employee}_Employee{department(foo)}')).not
            .to.be.undefined;
        });
        it('parses unidirectional ManyToOne relationships', () => {
          expect(jdlObject.relationships.getManyToOne('ManyToOne_Employee{manager}_Employee')).not.to.be.undefined;
        });
        it('parses ManyToMany relationships', () => {
          expect(jdlObject.relationships.getManyToMany('ManyToMany_Job{task(title)}_Task{job}')).not.to.be.undefined;
        });
        it('parses comments in relationships for owner', () => {
          const relationship = jdlObject.relationships.getOneToMany(
            'OneToMany_Department{employee}_Employee{department(foo)}'
          );
          expect(relationship.commentInFrom).to.eq('A relationship');
          expect(relationship.commentInTo).to.equal('Another side of the same relationship');
        });
        it('parses comments in relationships for owned', () => {
          const entities = new Map([
            ['Department', readJsonEntity('Department')],
            ['Employee', readJsonEntity('Employee')]
          ]);
          const jdlObject = convertEntitiesToJDL({ entities });
          const relationship = jdlObject.relationships.getOneToMany(
            'OneToMany_Department{employee}_Employee{department(foo)}'
          );
          expect(relationship.commentInFrom).to.equal('A relationship');
          expect(relationship.commentInTo).to.eq('Another side of the same relationship');
        });
        it('parses required relationships in owner', () => {
          const relationship = jdlObject.relationships.getOneToMany(
            'OneToMany_Department{employee}_Employee{department(foo)}'
          );
          expect(relationship.isInjectedFieldInFromRequired).to.be.true;
          expect(relationship.isInjectedFieldInToRequired).to.be.undefined;
        });
        it('parses required relationships in owned', () => {
          const relationship = jdlObject.relationships.getManyToMany('ManyToMany_Job{task(title)}_Task{job}');
          expect(relationship.isInjectedFieldInToRequired).to.be.true;
          expect(relationship.isInjectedFieldInFromRequired).to.be.undefined;
        });
      });

      context('when parsing entities with relationships to User', () => {
        context('when skipUserManagement flag is not set', () => {
          context('when there is no User.json entity', () => {
            let jdlObject;

            before(() => {
              jdlObject = convertEntitiesToJDL({ entities: new Map([['Country', readJsonEntity('Country')]]) });
            });

            it('parses relationships to the JHipster managed User entity', () => {
              expect(jdlObject.relationships.getOneToOne('OneToOne_Country{user}_User')).not.to.be.undefined;
            });
          });
          context('when there is a User.json entity', () => {
            let entities;

            before(() => {
              entities = new Map([
                ['Country', readJsonEntity('Country')],
                ['User', readJsonEntity('Region')]
              ]);
            });

            it('throws an error ', () => {
              expect(() => {
                convertEntitiesToJDL({
                  entities
                });
              }).to.throw('User entity name is reserved if skipUserManagement is not set.');
            });
          });
        });
        context('when skipUserManagement flag is set', () => {
          let jdlObject;

          before(() => {
            const regionEntity = readJsonEntity('Region');
            regionEntity.relationships[0].otherEntityRelationshipName = 'user';
            const entities = new Map([
              ['Country', readJsonEntity('Country')],
              ['User', regionEntity]
            ]);
            jdlObject = convertEntitiesToJDL({ entities, skippedUserManagement: true });
          });

          it('parses the User.json entity if skipUserManagement flag is set', () => {
            expect(jdlObject.entities.Country).not.to.be.undefined;
            expect(jdlObject.entities.User).not.to.be.undefined;
            expect(jdlObject.entities.User.fields.regionId).not.to.be.undefined;
            expect(jdlObject.relationships.getOneToOne('OneToOne_Country{user}_User{country}')).not.to.be.undefined;
          });
        });
        context('without relationship', () => {
          let jdlObject;

          before(() => {
            jdlObject = convertEntitiesToJDL({
              entities: new Map([['CassBankAccount', readJsonEntity('CassBankAccount')]])
            });
          });

          it('parses tableName', () => {
            expect(jdlObject.entities.CassBankAccount.tableName).eq('cassBankAccount');
          });
        });
      });

      context('when parsing relationships with options', () => {
        context('such as jpaDerivedIdentifier', () => {
          it('accepts it', () => {
            expect(
              jdlObject.relationships.getOneToOne('OneToOne_Country{region}_Region{country}').options[
                JPA_DERIVED_IDENTIFIER
              ]
            ).to.be.true;
          });
        });
      });

      context('when parsing an unrecognised blob-typed field', () => {
        it('fails', () => {
          expect(() =>
            convertEntitiesToJDL({ entities: new Map([['InvalidBlobType', readJsonEntity('InvalidBlobType')]]) })
          ).to.throw("Unrecognised blob type: 'unknown'");
        });
      });
    });
    context('when parsing relationships including the User entity', () => {
      let entities;

      before(() => {
        entities = new Map([
          [
            'TestEntity',
            JSON.parse(
              fs
                .readFileSync(
                  path.join('test', 'test_files', 'json_to_jdl_converter', 'with_user', '.jhipster', 'TestEntity.json'),
                  'utf-8'
                )
                .toString()
            )
          ]
        ]);
      });

      it('should not fail', () => {
        expect(() => convertEntitiesToJDL({ entities })).not.to.throw();
      });
    });
  });
});

function readJsonEntity(entityName) {
  return JSON.parse(
    fs
      .readFileSync(path.join('test', 'test_files', 'jhipster_app', '.jhipster', `${entityName}.json`), 'utf-8')
      .toString()
  );
}
