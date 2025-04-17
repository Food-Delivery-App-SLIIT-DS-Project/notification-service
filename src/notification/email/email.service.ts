import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // constructor() {
  //   console.log('Email service initialized');
  //   console.log(process.env.EMAIL_PASS);
  // }

  async send(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"FoodDelivery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
