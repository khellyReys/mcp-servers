/**
 * Function to generate a report breakdown for Facebook Ads.
 *
 * @param {Object} args - Arguments for the report generation.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.token - The access token for authentication.
 * @param {string} [args.report_attribution_id2] - Optional report attribution ID.
 * @param {string} [args.since="2023-04-26"] - The start date for the time range.
 * @param {string} [args.until="2023-05-28"] - The end date for the time range.
 * @returns {Promise<Object>} - The result of the report generation.
 */
const executeFunction = async ({ account_id, token, report_attribution_id2, since = "2023-04-26", until = "2023-05-28" }) => {
  const baseUrl = 'https://graph.facebook.com/v12.0';
  const url = `${baseUrl}/act_${account_id}/insights?${report_attribution_id2 || ''}`;
  
  const requestBody = {
    level: "ad",
    time_range: {
      since,
      until
    },
    breakdowns: "hourly_stats_aggregated_by_advertiser_time_zone",
    action_breakdowns: ["action_type"],
    action_attribution_windows: ["1d_click", "7d_click", "28d_click", "1d_view", "7d_view", "28d_view"],
    fields: ["actions", "action_values", "ad_id", "clicks", "impressions", "reach", "spend", "account_currency", "unique_clicks", "video_thruplay_watched_actions", "video_30_sec_watched_actions", "video_avg_time_watched_actions", "video_p100_watched_actions", "video_p25_watched_actions", "video_p50_watched_actions", "video_p75_watched_actions", "video_p95_watched_actions"],
    time_increment: "1",
    graphapi_sample: true,
    graphapi_user: "511439423"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating report breakdown:', error);
    return { error: 'An error occurred while generating the report breakdown.' };
  }
};

/**
 * Tool configuration for generating report breakdowns for Facebook Ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'ReportidBreakdownGenerate',
      description: 'Generate a report breakdown for Facebook Ads.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID.'
          },
          token: {
            type: 'string',
            description: 'The access token for authentication.'
          },
          report_attribution_id2: {
            type: 'string',
            description: 'Optional report attribution ID.'
          },
          since: {
            type: 'string',
            description: 'The start date for the time range.'
          },
          until: {
            type: 'string',
            description: 'The end date for the time range.'
          }
        },
        required: ['account_id', 'token']
      }
    }
  }
};

export { apiTool };