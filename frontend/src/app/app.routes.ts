import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
    { path: 'product/:id', component: ProductDetailComponent, data: { animation: 'DetailPage' } },
    { path: 'cart', component: CartComponent, data: { animation: 'CartPage' } },
    {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { animation: 'CheckoutPage' }
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/otp-auth.component').then(m => m.OtpAuthComponent)
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin',
        canActivate: [adminAuthGuard],
        children: [
            { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
            {
                path: 'products',
                loadComponent: () => import('./pages/admin/products/product-list.component').then(m => m.AdminProductListComponent)
            },
            {
                path: 'products/new',
                canDeactivate: [canDeactivateGuard],
                loadComponent: () => import('./pages/admin/products/product-edit.component').then(m => m.AdminProductEditComponent)
            },
            {
                path: 'products/edit/:id',
                canDeactivate: [canDeactivateGuard],
                loadComponent: () => import('./pages/admin/products/product-edit.component').then(m => m.AdminProductEditComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.AdminOrdersComponent)
            }
        ]
    },
    {
        path: 'terms',
        loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent),
        data: {
            title: 'Terms & Conditions',
            type: 'terms',
            content: `TERMS AND CONDITIONS

This page states the Terms and Conditions. Please read this page carefully. If you do not accept the Terms and Conditions stated here, we request you to exit this site.

The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. It is advised that you visit this page periodically to re-appraise yourself of the Terms and Conditions as they are binding on all users of this Website.

Acknowledgement

By ordering online, you acknowledge and agree that the use of the online ordering application and/or processes at your own risk and the maximum extent permitted according to the applicable law, in no circumstances, shall We be liable for any direct, indirect, incidental, special, consequential, or punitive damages, losses, costs or expenses nor for any loss of profit that results from the use of, or inability to use this online ordering and/or any application and/or material on any site linked to this online ordering application (including but not limited to any viruses or any other errors or defects or failures in computer transmissions or network communications) even if he have been advised of the possibility of such damage. In addition, no liability can be accepted by us in respect of any changes made to the content of the online ordering application and/or process by unauthorized third parties. All express or implied warranties or representations are excluded to the maximum extent permitted according to the applicable law.

The online ordering application and/or process may include content, information or links to third parties or third party sites. The Restaurant is not responsible for the content of any such sites or neither for the content of any third party advertising or sponsorship nor for compliance of such with any regulations. The links may be accessed at the user's own risk and the Restaurant makes no representations or warranties about the content, completeness, or accuracy of these links or the sites hyperlinked to this ordering online application. You agree to hold harmless and relieve the Restaurant from any liability whatsoever arising from your use of information from a third party or your use of any third-party website.

Except otherwise expressly mentioned, all the information in relation with the online ordering application (including without limitation the images, buttons and text) are property and/or available with the permission of the licensor of the license agreement regarding the use of the application in order to order online and holds usage rights over them and, may not be copied, distributed, or reproduced or transmitted in any form or by any mean, electronic, mechanical, photocopying, recording or otherwise, without its prior written permission.

The content referring to specific products (e.g. food items), arrangement and texts layout of the online ordering application and/or process, the trademarks, and any other content, are proprietary and are protected according with the legal regulations in force and cannot be used in any way without the express written permission of the Restaurant.
The Client does not obtain any license or right regarding the information in relation with the online ordering and/or application.

If you decide to order online using the online ordering application, you may be asked to provide full contact details and/or to create an account and you may need to accept cookies. You must keep your data confidential and must not disclose it to anyone. The Restaurant reserves the right to suspend the use of the online ordering application and/or process if you breach the Terms and Conditions.

You acknowledge and agree that all orders are treated as an express intention to purchase the nominated products and/or services for the agreed online prices and we treat this as a binding offer from you to purchase such products and services. Any variations must be in writing; otherwise they will not be binding on either party.

The acceptance of any order for any of the products and/or services shall be at the sole discretion of the Restaurant. Our acceptance of an order may occur when you receive an on-screen message and/or email notification and/or an SMS, confirming your order.

The Restaurant reserves the right to refuse any service, terminate your access to the online ordering application and/or process, remove or edit any content or accept your order/s in its sole discretion and without prior notice to you.
The Restaurant's online ordering application must only be used by persons over the age of eighteen (18) years, or the minimum legal age as permitted by the law or otherwise under the supervision of an adult or guardian.

Any products and/or services provided through the online ordering application are done so on an "as is" and "if available" basis and the Restaurant expressly excludes any warranties, conditions, representations or other terms with respect to the online ordering or the content or products displayed on it, whether express or implied, unless expressly stated to the contrary.

The pictures of the products are for presentation only. The ordered products may have differences (e.g. color, form, etc.) towards the photos existing on the site. The Restaurant is not liable in any way if the description of products is not complete.

Delivery orders are also subject to:

i) Your address falling in the defined delivery area of the Restaurant;

 Ii) Availability of the restaurant being online for accepting online orders;

iii) Your Order may be subject to a minimum amount per order.

USE OF CONTENT

All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under license, by the business and / or its associate entities who feature on this website. The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.

You may not sell or modify the content of this website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organization’s or entity’s written permission.`
        }
    },
    {
        path: 'privacy',
        loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent),
        data: {
            title: 'Privacy Policy',
            type: 'privacy',
            content: `Privacy Policy

Information we collect
When you use our online ordering application, we may collect personal information such as your name, email address, phone number, and billing information. We may also collect information about your device and browser, such as your IP address, browser type, and operating system.

How we use your information
We use your personal information to process your orders, provide customer support, and communicate with you about our products and services. We may also use your information to improve our online ordering application and to prevent fraud.

Sharing your information
We may share your personal information with third-party service providers who help us process your orders, such as payment processors and delivery services. We may also share your information with government authorities or law enforcement if required by law.

Security
We take the security of your personal information seriously and take reasonable measures to protect it. We use SSL encryption to protect your payment information, and we limit access to your personal information to authorized personnel.

Changes to this policy
We may update this privacy policy from time to time. If we make any significant changes, we will notify you by email or by posting a notice on our website.

By using our online ordering application, you consent to our collection, use, and sharing of your personal information as described in this privacy policy.`
        }
    },
    {
        path: 'shipping',
        loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent),
        data: {
            title: 'Shipping Policy',
            type: 'shipping',
            content: `Shipping Policy

We are committed to providing you with a seamless and enjoyable food delivery experience. Please take a moment to review our shipping policy.

1. Delivery Zones and Coverage:
We currently deliver to limited zones/areas for details kindly connect with our customer support number or email us. We do not deliver to areas outside these specified zones.

2. Delivery Timeframes:
Our delivery times vary based on your location and order volume. Please note that actual delivery times may be affected by traffic, weather conditions, or other unforeseen circumstances.

3. Order Confirmation:
Upon successful placement of your order, you will be able to see order confirmation within the application. This confirmation will include your order details. Track your order in real-time through our app for the latest updates.

4. Delivery Charges:
We keep our delivery fees affordable. The delivery charge will be clearly displayed during the checkout process. 

5. Minimum Order Amount:
To qualify for delivery, there is a minimum order amount. Orders below this threshold may be subject to additional charges or may need to be picked up.

6. Delivery Partners:
We may partner with reliable third-party delivery services to bring your orders to your doorstep. Each delivery partner follows our guidelines to ensure a secure and efficient delivery process.

7. Changes and Cancellations:
You can make changes or cancel your order before it is accepted. After this time, changes or cancellations may not be possible. Please contact our customer support team for assistance.

8. Inclement Weather Policy:
In the event of adverse weather conditions, delivery times may be affected. We appreciate your understanding in such situations, and our team will do its best to minimize any disruptions to your delivery.

9. Refund and Returns:
For issues related to the quality of the delivered food, incorrect orders, or damaged items, please contact our customer support team immediately. 

10. Customer Support:
Our customer support team is available to assist you. Feel free to reach out via contact number mentioned on the website, and we will be happy to address any questions or concerns.

11. Terms of Service:
By using our food delivery application, you agree to our Terms.`
        }
    },
    {
        path: 'cancellation',
        loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent),
        data: {
            title: 'Cancellation & Refund Policy',
            type: 'cancellation',
            content: `Cancellation and Refund Policy

You can pay by any of the methods listed in our checkout screen. Please make sure that if your order is placed using a credit or debit card, the card is valid on the date of your order placement. The Restaurant may provide no refunds to the orders paid online. We request you to contact us directly to settle any payment dispute or refund claim. In addition, please note that if you order on-line, the price charged may be different to the price for the Products had they been ordered in-store or by telephone.

The online order once placed cannot be modified or cancelled either through the website or offline by calling the restaurant. Anyhow, if you wish to cancel or complain about your order, please call your local restaurant service location, details of which will be included in the confirmatory e-mail sent to you upon placing your order and we shall try our best to help you.

We will aim to provide you with your ordered products as close as possible to your requested delivery/collection time but we cannot guarantee the delivery time in all the cases. Delivery time may be affected due to bad weather or traffic conditions. This is to ensure the safety of our riders. Delivery service may be temporarily unavailable in selected areas due to bad weather or unforeseen circumstances.

The Client agrees to accept delivery of the Products at the agreed time and place of delivery. If you have chosen for the Products to be delivered, the Restaurant will deliver the order to the main entrance of the delivery address but any deliveries carried into the delivery address will only be made if the driver and you consent to this. If you are not present to take delivery of the goods at the address given in your order, then we shall not refund you the price for your order and will have to charge you for the full amount of your order.`
        }
    },
    { path: '**', redirectTo: '' }
];
