'use strict';

import db from '../components/app-dbs.js';
import RSVP from 'rsvp';

const PROJECTS_KEY = 'coinstac-projects';
const Promise = RSVP.Promise;
const projectsDatabase = db.register({ name: PROJECTS_KEY });
const projects = {
    add: function (project) {
        return projectsDatabase.add(project);
    },
    all: function () {
        return projectsDatabase.all();
    },
    delete: function (id) {
        // TODO: Implement this method
        // return new Promise(function (resolve, reject) {
        //     projects.find(id).then(function (doc) {
        //         return projectsDatabase.delete(doc).then(resolve).catch(reject);
        //     }).catch(reject);
        // });

        // return projects.find(id).then(projectsDatabase.delete);
    },
    find: function (id) {
        return projectsDatabase.get(id);
    },
    update: function (project) {
        const options = {
            _id: project._id,
            _rev: project._rev
        };

        return projectsDatabase.update(project, options);
    },
};

export default projects;

// export default function () { return 'hey'; };
