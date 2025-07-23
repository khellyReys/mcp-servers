/**
 * Function to get details of campaigns from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the campaign details request.
 * @param {string} args.account_id - The ID of the ad account to retrieve campaigns from.
 * @param {string} args.token - The access token for authorization.
 * @returns {Promise<Object>} - The details of the campaigns.
 */
const executeFunction = async ({ account_id }) => {
  const base_url = 'https://graph.facebook.com/v12.0'; // Base URL for the Facebook Marketing API
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/campaigns?fields=id,name,objective,account_id,buying_type,daily_budget,lifetime_budget,spend_cap,bid_strategy,pacing_type,status,effective_status,promoted_object,recommendations,start_time,stop_time,created_time,updated_time,adlabels,issues_info,special_ad_categories,special_ad_category_country,smart_promotion_type,is_skadnetwork_attribution`;

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
    console.error('Error fetching campaign details:', error);
    return { error: 'An error occurred while fetching campaign details.' };
  }
};

/**
 * Tool configuration for getting campaign details from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetCampaignsDetails',
      description: 'Get details of campaigns from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the ad account to retrieve campaigns from.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };