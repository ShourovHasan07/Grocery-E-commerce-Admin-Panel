"use client";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

const Pricing = ({ data }) => {
  // Default pricing plans if no data is provided
  const defaultPlans = [
    {
      title: "Basic",
      price: "$9",
      period: "month",
      features: [
        "10 Projects",
        "5 GB Storage",
        "Basic Support",
        "Analytics Dashboard"
      ],
      popular: false
    },
    {
      title: "Pro",
      price: "$29",
      period: "month",
      features: [
        "Unlimited Projects",
        "50 GB Storage",
        "Priority Support",
        "Advanced Analytics",
        "Custom Integrations"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: "$99",
      period: "month",
      features: [
        "Unlimited Everything",
        "Dedicated Support",
        "Custom Features",
        "API Access",
        "SLA Guarantee"
      ],
      popular: false
    }
  ];

  const plans = data || defaultPlans;

  return (
    <Box className="flex flex-col gap-8">
      <Typography variant="h4" className="text-center mb-6">
        Choose Your Plan
      </Typography>

      <Grid container spacing={4}>
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              className={`relative h-full ${plan.popular ? "border-2 border-primary shadow-primarySm" : ""
                }`}
            >
              {plan.popular && (
                <Box
                  className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm rounded-bl-lg"
                >
                  Popular
                </Box>
              )}
              <CardContent className="p-6 flex flex-col h-full">
                <Typography variant="h5" className="text-center mb-2">
                  {plan.title}
                </Typography>

                <Box className="text-center mb-4">
                  <Typography variant="h3" component="span">
                    {plan.price}
                  </Typography>
                  <Typography variant="body1" component="span" className="ml-1">
                    /{plan.period}
                  </Typography>
                </Box>

                <List className="flex-grow mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} className="p-0">
                      <ListItemIcon className="min-w-[24px] mr-2">
                        <i className="tabler-check text-success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.popular ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  className="mt-auto"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pricing;
