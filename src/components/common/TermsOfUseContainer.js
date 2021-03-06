import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import messages from '../../resources/messages';

/*
 * This requies `tagUtil.mediaSourceMetadataProps(source)` to have been called in the reducer to fill
 * in the named metadata properties on the source object.
 */
const TermsOfUseContainer = () => {
  const termsOfUseText = `Effective Date: May 15, 2019 \
    These Terms of Use govern your use of the Media Cloud Website (“Website”), accessible at mediacloud.org, and the Media Cloud API, Tools, and User Interface (together referred to as the “Platform”), accessible at tools.mediacloud.org. Media Cloud is a joint project of the MIT Center for Civic Media and the Berkman Klein Center for Internet & Society at Harvard University. Media Cloud is based at 20 Ames Street, Cambridge, MA 02139, USA. These Terms of Use apply only to the Media Cloud Website and Platform, and not to other projects of the Center for Civic Media or the Berkman Klein Center. As referred to in this agreement, affiliates of Media Cloud include, but are not limited to, the Berkman Klein Center, MIT, Harvard University, employees of Media Cloud, and other agents of Media Cloud.\
    
    If you have any questions or concerns about this Terms of Use or any other matters, you can contact us at support@mediacloud.org.\
    
    1.  User Agreement\
    
    1.1 Acceptance \
    By clicking on the “I ACCEPT” button during the account registration process, accessing the Platform, or using the Platform, you represent that (i) you have read, understand, and agree to be bound by the Terms of Use and (ii) you are 13 years or older. If you do not agree to be bound by the Terms of Use or are not at least 13 years of age, you may not register an account or access or use the Platform.\
    
    1.2 Privacy\
    All information collected on or by this Website and Platform is subject to our Privacy Policy. By accepting this Terms of Use, you also consent to the Media Cloud Privacy Policy and all actions taken by us with respect to your information in compliance with the Policy.\
    
    1.3 Changes to the Terms of Use\
    Media Cloud may revise and update these Terms of Use and the Privacy Policy from time to time. When we do so, we will post the revised Terms of Use on this webpage, the revised Privacy Policy at https://mediacloud.org/privacy-policy, send an alert through the platform (e.g. through the “Recent Changes” alert function), and/or send you an email disclosing the changes. Your continued use of the Platform means that you accept and agree to the changes.\
    
    2. Rules of Usage\
    
    2.1 Allowable Uses of the Platform \
    After creating an account, you will be assigned an API key that will give you to access the Media Cloud API, Tools, and User Interface (together referred to as the “Platform”). You may use the Platform for any lawful use, subject to the limitations outlined in these Terms of Use and Section 2.4, and with the knowledge that the Platform is designed for and is best fitted to academic, nonprofit, and journalistic research and not designed for use as a commercial tool for, e.g., market and brand research.\
    
    2.2 Allowable Uses of Platform Outputs and Attribution\
    "Platform Outputs" include aggregated data and/or analyses produced by the Platform (e.g. “number of media mentions in 2019,” “related words in media mentions”) and images generated by the Platform (e.g. charts, “word clouds”). You may use, reproduce, distribute, and/or display any Platform Outputs, including directly copying them.\
    We highly recommend, but do not require, that you attribute Media Cloud when using, reproducing, distributing, and/or displaying any Platform Outputs. We also highly recommend that you attribute Highsoft, the owner of the Highcharts software that we license to generate some of our Platform Outputs. For examples and best practices regarding attribution, see our Attribution webpage. \
    If you choose to attribute to Media Cloud, you may link to the Media Cloud Website homepage, provided you do so in a way that is fair and legal and does not damage our reputation or take advantage of it. You must not establish a link in such a way as to suggest any form of association, approval, or endorsement on our part without our express and written content.\
    
    2.3 Rights to Third-Party Content\
    In contrast to Platform Outputs, which you can use freely, Media Cloud does not own the content (e.g. news stories, blogs) of third-party sources analyzed by or linked to by the Platform. MEDIA CLOUD CANNOT AND DOES NOT GIVE YOU PERMISSION TO USE, REPRODUCE, DISTRIBUTE, AND/OR DISPLAY ANY THIRD-PARTY CONTENT. If you choose to use, reproduce, distribute, and/or display that content, you must do so in accordance with the intellectual property rights and/or terms of use of the relevant third-party source(s).\
    
    2.4 Limitations on Use\
    
    ·       You may not use the Platform to infringe on or violate the intellectual property rights, privacy rights, publicity rights or any other rights of any person or entity.
    
    ·       You may not use an unreasonable amount of bandwidth or exceed any API request limit. \
    
    ·       You may not make multiple accounts in order to circumvent the API request limit.\
    
    ·       You may not post material to the Platform that advertises or sells a product or service or functions as spam.\
    
    ·       You may not impede or interfere with others’ use of the Platform, intentionally disrupt, attack, modify, or interfere with the proper working of the Platform in any way, or attempt to gain unauthorized access to Media Cloud’s servers by any means. \
    
    ·       You may not use the Platform in connection with spyware, malware, or other malicious programs or code. \
    
    ·       You may not sell, lease or sublicense the Media Cloud Platform, any Media Cloud API key, or access thereto. \
    \
    
    2.5 Access to the Platform and Website\
    When possible, Media Cloud will try to notify you of any expected restriction of access to or functionality of the Platform and Website. However, we reserve the right to amend or take down the Platform and Website and any service or material we provide on the Platform and Website in our sole discretion with or without notice. From time to time, we may restrict access to all or some parts of the Platform to users, including registered users. Media Cloud will not be liable if all or any part of the Platform or Website is unavailable at any time or for any period.\
    
    2.6 Deletion of User Content and Account\
    Media Cloud has the right, in our sole discretion, to delete any information linked to your account, close your account, and limit or terminate your access to the Platform for violations of this Terms of Use, violations of any other law or public policy, or to protect Media Cloud, MIT, Harvard, or any other entity or individual from liability, including but not limited to copyright liability. \
    
    3. Media Cloud’s Intellectual Property \
    Media Cloud owns and retains all rights in and to the Platform and Website, including, but not limited to, the design, functionality, and architecture of the Platform and Website. You may access, use, copy, modify, and commercialize the open source code of the Platform, under the GNU Affero General Public License Version 3 or any later version. Except for any rights explicitly granted under these Terms of Use, you are not granted any rights in and to any Media Cloud intellectual property. \
    
    4. Ownership of User Content; Responsibility for User Content and Blog Posts
    Media Cloud does not own or seek to own, use, or license any content that you may post or create through the Platform or any Platform Outputs. 
    Media Cloud is not responsible for any user content created through the Platform (e.g. through Public Topics) and has no obligation to pre-screen or monitor content. We do not endorse, support, sanction, encourage, verify, or agree with the comments, opinions, or statements posted or otherwise provided by any Platform user or third-party source. Media Cloud shall have no liability to you or anyone regarding any information or materials posted by Platform users including defamatory, offensive or illicit material, even material that violates this Terms of Use.\
    All statements and/or opinions expressed in the Media Cloud Blog Posts that are signed by individual authors are solely the opinions and the responsibility of the author(s) providing those materials. These materials do not necessarily reflect the opinion of Media Cloud. \
    
    5. Disclaimers of Warranty\
    
    5.1 Information Gathered by Media Cloud\
    YOU ARE USING THE INFORMATION GATHERED, ANALYZED, LINKED TO, OR AGGREGATED BY MEDIA CLOUD AT YOUR OWN RISK. THE AVAILABILITY AND CONTENT OF ANY INFORMATION ON THE PLATFORM MAY CHANGE AT ANY TIME WITHOUT NOTICE. 
    The Platform gathers, analyzes and links to information aggregated from thousands of third-party sources. The automated collection process and the nature and breadth of the information limit our ability to independently verify any of the information. Media Cloud does not warrant the comprehensiveness, completeness, accuracy, or adequacy of the information for any purpose. We disclaim all warranties, express or implied, and shall not be responsible for any loss or damage that may directly or indirectly arise as the result of the use of the information contained in the service.\
    
    5.2 General Disclaimer of Warranty\
    YOU ARE USING THE PLATFORM, WEBSITE, AND EXTERNAL LINKS TO THIRD-PARTY WEBSITES AT YOUR OWN RISK. The Platform, Website, and external links are provided "as is," and Media Cloud and its affiliates disclaim any and all warranties, express and implied, including but not limited to any warranties of accuracy, reliability, title, merchantability, non-infringement, fitness for a particular purpose or any other warranty, condition, guarantee or representation, whether oral, in writing or in electronic form, including but not limited to the accuracy or completeness of any information contained therein or provided by the Platform, Website, and external links. Media Cloud and its affiliates do not represent or warrant that access to the Platform, Website, and external links will be uninterrupted or that there will be no failures, errors or omissions or loss of transmitted information, or that no viruses will be transmitted through the Platform, Website, or external links.\
    
    6. Indemnification\
    You agree to indemnify Media Cloud and its affiliates and to defend and hold each of them harmless, from any and all claims and liabilities (including attorneys' fees) arising out of or related to your breach of this Agreement or your use of the Platform.\
    
    7. Limitation of Liability\

    Media Cloud and its affiliates shall not be liable to you or any third parties for any direct, indirect, special, consequential or punitive damages of any kind arising out of use or inability to use the Platform or Website, unauthorized access to your data, statements or conduct of any third party on the Platform or Website, or any other matter related to the Platform or Website, whether based on warranty, copyright, contract, tort, product liability, or any other legal theory.\
    
    8. Choice of Law and Venue\
    This Terms of Use, for all purposes, shall be governed and construed in accordance with the laws of the Commonwealth of Massachusetts, USA, applicable to contracts to be wholly performed therein, and any action based on, relating to, or alleging a breach of this Agreement must be brought in a state or federal court in Middlesex County, Massachusetts. In addition, you agree to submit to the exclusive personal jurisdiction and venue of such courts.\
    
    9. Entire Agreement \
    This Agreement constitutes the entire agreement between you and Media Cloud and supersedes all previous agreements relating to the use of the Platform and Website. `;
  return (
    <div className="privacy-policy">
      <TextField
        multiline
        fullWidth
        rowsMax={20}
        label={messages.termsOfUse}
        value={termsOfUseText}
      />
    </div>
  );
};

export default
injectIntl(
  TermsOfUseContainer
);
