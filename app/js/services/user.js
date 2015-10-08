/**
 * Mock user service.
 *
 * @todo  Build out user service.
 */
const User = {
    get(id) {
        return new Promise(resolve => {
            resolve({
                id,
                username: 'test-user',
                label: 'Test User',
                email: 'test@user.net',
            });
        });
    }
}

export default User;
