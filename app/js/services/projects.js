'use strict';

import db from './db-registry.js';
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
        return projects.find(id)
            .then(projectsDatabase.delete.bind(projectsDatabase));
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
