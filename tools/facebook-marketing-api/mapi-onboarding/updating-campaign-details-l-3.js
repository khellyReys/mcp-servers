/**
 * Function to update campaign details in the Marketing API.
 *
 * @param {Object} args - Arguments for updating the campaign.
 * @param {string} args.campaign_id - The ID of the campaign to update.
 * @param {string} args.name - The new name for the campaign.
 * @param {number} args.daily_budget - The daily budget for the campaign.
 * @param {string} args.special_ad_categories - The special ad category for the campaign.
 * @param {string} args.status - The status of the campaign (e.g., PAUSED).
 * @param {Array<string>} args.special_ad_category_country - The countries for the special ad category.
 * @returns {Promise<Object>} - The result of the campaign update.
 */
const executeFunction = async ({ campaign_id, name, daily_budget, special_ad_categories, status, special_ad_category_country }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = new URL(`${baseUrl}/${campaign_id}`);
    url.searchParams.append('name', name);
    url.searchParams.append('daily_budget', daily_budget.toString());
    url.searchParams.append('special_ad_categories', special_ad_categories);
    url.searchParams.append('status', status);
    url.searchParams.append('special_ad_category_country', JSON.stringify(special_ad_category_country));

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'POST',
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
    console.error('Error updating campaign details:', error);
    return { error: 'An error occurred while updating campaign details.' };
  }
};

/**
 * Tool configuration for updating campaign details in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_campaign_details',
      description: 'Update details of a campaign in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to update.'
          },
          name: {
            type: 'string',
            description: 'The new name for the campaign.'
          },
          daily_budget: {
            type: 'number',
            description: 'The daily budget for the campaign.'
          },
          special_ad_categories: {
            type: 'string',
            description: 'The special ad category for the campaign.'
          },
          status: {
            type: 'string',
            description: 'The status of the campaign (e.g., PAUSED).'
          },
          special_ad_category_country: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The countries for the special ad category.'
          }
        },
        required: ['campaign_id', 'name', 'daily_budget', 'special_ad_categories', 'status', 'special_ad_category_country']
      }
    }
  }
};

export { apiTool };