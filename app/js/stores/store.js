'use strict';

export const files = [
    'my-file-1', 'my-file-2', 'my-file-3', 'my-file-4', 'my-file-5',
    'my-file-6', 'file-id-88', 'file-id-99'
];
export const consortia = [{
    id: 'my-sweet-consortia',
    name: 'My Sweet Consortia'
}, {
    id: 'my-ill-thingy',
    name: 'Illest Consort'
}, {
    id: 'regular-old-consortium',
    name: 'Regular Old Consortium'
}];
export const myProjects = [{
    id: 'project-101',
    name: 'My Sweet Project',
    files: ['file-id-1', 'file-id-2', 'file-id-3'],
    consortia: ['my-sweet-consortia']
}, {
    id: 'project-103',
    name: 'My Okay Project',
    files: ['file-id-88', 'file-id-99'],
    consortia: ['my-sweet-consortia']
}];
