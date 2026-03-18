import { Request, Response, NextFunction } from "express";
import * as appointmentService from "../services/appointment.service";
import { sendSuccess, sendError } from "../utils";

export async function getMyAppointments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = req.user!.role;
    const filters = {
      status: req.query.status as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    let appointments;
    if (role === "dietitian") {
      appointments = await appointmentService.getAppointmentsByDietitian(
        req.user!.userId,
        filters
      );
    } else {
      appointments = await appointmentService.getAppointmentsByPatient(
        req.user!.userId
      );
    }

    sendSuccess({
      res,
      data: appointments,
      message: "Randevular getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getAppointmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id as string
    );
    sendSuccess({
      res,
      data: appointment,
      message: "Randevu detayi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await appointmentService.createAppointment(
      req.user!.userId,
      req.user!.role,
      req.body
    );
    sendSuccess({
      res,
      data: appointment,
      message: "Randevu basariyla olusturuldu",
      statusCode: 201,
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status,
      req.body.notes
    );
    sendSuccess({
      res,
      data: appointment,
      message: "Randevu durumu guncellendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getAvailableSlots(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { date } = req.query;
    if (!date) {
      sendError({
        res,
        message: "date parametresi gerekli",
        statusCode: 400,
      });
      return;
    }

    const slots = await appointmentService.getAvailableSlots(
      req.params.dietitianId as string,
      date as string
    );
    sendSuccess({
      res,
      data: slots,
      message: "Musait zaman dilimleri getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
