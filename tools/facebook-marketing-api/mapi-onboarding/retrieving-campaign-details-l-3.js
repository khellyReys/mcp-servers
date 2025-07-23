/**
 * Function to retrieve campaign details from the Marketing API.
 *
 * @param {Object} args - Arguments for retrieving campaign details.
 * @param {string} args.account_id - The ID of the account to retrieve campaign details for.
 * @param {string} [args.base_url] - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The campaign details or an error message.
 */
const executeFunction = async ({ account_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/${account_id}?fields=id,account_id,name,status,start_time,stop_time,objective,daily_budget,lifetime_budget,bid_strategy,buying_type,smart_promotion_type,special_ad_category,special_ad_category_country,spend_cap,promoted_object`;

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
    console.error('Error retrieving campaign details:', error);
    return { error: 'An error occurred while retrieving campaign details.' };
  }
};

/**
 * Tool configuration for retrieving campaign details from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_campaign_details',
      description: 'Retrieve campaign details from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the account to retrieve campaign details for.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };