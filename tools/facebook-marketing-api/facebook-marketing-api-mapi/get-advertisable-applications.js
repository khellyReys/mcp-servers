/**
 * Function to get advertisable applications from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The Ad Account ID.
 * @param {string} args.token - The access token for authorization.
 * @returns {Promise<Object>} - The list of advertisable applications.
 */
const executeFunction = async ({ account_id }) => {
  const base_url = 'https://graph.facebook.com/v12.0'; // Facebook Graph API base URL
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;

  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/advertisable_applications?fields=id,name,app_install_tracked,app_name,app_type,category,icon_url,ipad_app_store_id,iphone_app_store_id,link,mobile_web_url,object_store_urls,supported_platforms,website_url,photo_url,advertisable_app_events`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching advertisable applications:', error);
    return { error: 'An error occurred while fetching advertisable applications.' };
  }
};

/**
 * Tool configuration for getting advertisable applications from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetAdvertisableApplications',
      description: 'Get a list of advertisable applications from the specified Ad Account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The Ad Account ID to fetch advertisable applications for.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };