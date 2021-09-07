using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit;
using System.Threading.Tasks;

namespace AngularToAPI.Services
{
    public static class SendEmail
    {
        [HttpPost]
        public static async Task SendEmailAsync(string Email, string UserName,string link)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Cinama@gmail.com"));
            message.To.Add(new MailboxAddress(UserName,Email));
            message.Subject = "Registration Confirm";
            message.Body = new TextPart("plain")
            {
                Text = "Please confirm your registration at our Cinema site by clicking on the below link: \n"
                + link + "\n\n"
                + "Thank you"
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, false);

                //SMTP server authentication if needed
                client.Authenticate("Put you Email Here", "Email Password");

                client.Send(message);

                client.Disconnect(true);
            }

        }


    }
}